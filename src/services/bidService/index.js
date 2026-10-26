const crypto = require("crypto");

const bidRepository = require("../../repositories/bidRepository");

function createError(message, statusCode) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}

function generateBidHash(
    lotId,
    bidderId,
    amount,
    previousHash,
    createdAt
) {
    const data = [
        lotId,
        bidderId,
        Number(amount).toFixed(2),
        previousHash || "",
        createdAt.toISOString(),
    ].join("|");

    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
}

async function createBid(lotId, bidderId, amount) {
    const bidAmount = Number(amount);

    if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
        throw createError(
            "O valor do lance deve ser maior que zero.",
            400
        );
    }

    return bidRepository.transaction(async (transaction) => {
        const lot = await bidRepository.findLotById(
            lotId,
            transaction,
            true
        );

        if (!lot) {
            throw createError("Lote não encontrado.", 404);
        }

        const now = new Date();
        const startAt = new Date(lot.startAt);
        const endAt = new Date(lot.endAt);

        if (
            lot.status !== "LIVE" ||
            now < startAt ||
            now >= endAt
        ) {
            throw createError(
                "O lote não está aberto para lances.",
                400
            );
        }

        const latestBid = await bidRepository.findLatestBid(
            lot.id,
            transaction
        );

        if (
            latestBid &&
            Number(latestBid.bidderId) === Number(bidderId)
        ) {
            throw createError(
                "Você já é o líder atual e não pode enviar outro lance.",
                400
            );
        }

        const minimumBid = latestBid
            ? Number(latestBid.amount) +
              Number(lot.minimumIncrement)
            : Number(lot.startingPrice);

        if (bidAmount < minimumBid) {
            throw createError(
                `O lance mínimo permitido é ${minimumBid.toFixed(2)}.`,
                400
            );
        }

        const bidderWallet = await bidRepository.findWalletByBidderId(
            bidderId,
            transaction
        );

        if (!bidderWallet) {
            throw createError("Carteira não encontrada.", 400);
        }

        if (Number(bidderWallet.availableBalance) < bidAmount) {
            throw createError(
                "Saldo disponível insuficiente para realizar este lance.",
                400
            );
        }

        if (latestBid) {
            const previousWallet =
                await bidRepository.findWalletByBidderId(
                    latestBid.bidderId,
                    transaction
                );

            if (!previousWallet) {
                throw createError(
                    "Carteira do líder atual não encontrada.",
                    400
                );
            }

            previousWallet.committedBalance =
                Number(previousWallet.committedBalance) -
                Number(latestBid.amount);

            previousWallet.availableBalance =
                Number(previousWallet.availableBalance) +
                Number(latestBid.amount);

            await bidRepository.saveWallet(
                previousWallet,
                transaction
            );

            await bidRepository.createWalletTransaction(
                {
                    walletId: previousWallet.id,
                    type: "RELEASE",
                    amount: Number(latestBid.amount),
                },
                transaction
            );
        }

        bidderWallet.availableBalance =
            Number(bidderWallet.availableBalance) - bidAmount;

        bidderWallet.committedBalance =
            Number(bidderWallet.committedBalance) + bidAmount;

        await bidRepository.saveWallet(
            bidderWallet,
            transaction
        );

        const createdAt = new Date();
        const previousHash = latestBid ? latestBid.hash : null;

        const hash = generateBidHash(
            lot.id,
            bidderId,
            bidAmount,
            previousHash,
            createdAt
        );

        const bid = await bidRepository.createBid(
            {
                lotId: lot.id,
                bidderId,
                amount: bidAmount,
                previousHash,
                hash,
                createdAt,
            },
            transaction
        );

        await bidRepository.createWalletTransaction(
            {
                walletId: bidderWallet.id,
                type: "COMMIT",
                amount: bidAmount,
            },
            transaction
        );

        lot.currentPrice = bidAmount;

        const remainingTime = endAt.getTime() - now.getTime();
        const antiSnipingWindow = 2 * 60 * 1000;

        if (remainingTime <= antiSnipingWindow) {
            lot.endAt = new Date(
                now.getTime() + antiSnipingWindow
            );
        }

        await bidRepository.saveLot(lot, transaction);

        return bid;
    });
}

async function getBidsByLotId(lotId) {
    const lot = await bidRepository.findLotById(lotId);

    if (!lot) {
        throw createError("Lote não encontrado.", 404);
    }

    return bidRepository.findAllBidsByLotId(lotId);
}

async function getMyBids(bidderId) {
    return bidRepository.findAllBidsByBidderId(bidderId);
}

async function getLiveRoom(lotId, bidderId = null) {
    const lot = await bidRepository.findLotById(lotId);

    if (!lot) {
        throw createError("Lote não encontrado.", 404);
    }

    const bids = await bidRepository.findAllBidsByLotId(lotId);
    const currentBid = bids.length ? bids[bids.length - 1] : null;

    const bidderPosition = bidderId
        ? bids.findIndex(
            (bid) => Number(bid.bidderId) === Number(bidderId)
        ) + 1
        : null;

    const now = new Date();
    const endAt = new Date(lot.endAt);

    return {
        lotId: lot.id,
        status: lot.status,
        startingPrice: Number(lot.startingPrice),
        minimumIncrement: Number(lot.minimumIncrement),
        currentPrice: Number(lot.currentPrice),
        nextMinimumBid: currentBid
            ? Number(currentBid.amount) + Number(lot.minimumIncrement)
            : Number(lot.startingPrice),
        startAt: lot.startAt,
        endAt: lot.endAt,
        remainingTime: Math.max(0, endAt.getTime() - now.getTime()),
        isOpen:
            lot.status === "LIVE" &&
            now >= new Date(lot.startAt) &&
            now < endAt,
        currentLeaderId: currentBid ? currentBid.bidderId : null,
        isLeading: bidderId
            ? currentBid
                ? Number(currentBid.bidderId) === Number(bidderId)
                : false
            : null,
        position: bidderPosition > 0 ? bidderPosition : null,
        totalBids: bids.length,
    };
}

module.exports = {
    createBid,
    getBidsByLotId,
    getMyBids,
    getLiveRoom,
};
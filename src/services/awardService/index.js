const awardRepository = require("../../repositories/awardRepository");

const AwardNotFoundError = require("../../exceptions/domain/awards/AwardNotFoundError");
const LotNotClosableError = require("../../exceptions/domain/awards/LotNotClosableError");
const LotNotFinishedError = require("../../exceptions/domain/awards/LotNotFinishedError");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

async function closeLot(lotId) {
  return awardRepository.transaction(async (transaction) => {
    const lot = await awardRepository.findLotById(
      lotId,
      transaction,
      true
    );

    if (!lot) {
      throw new AwardNotFoundError();
    }

    if (lot.status === "CLOSED") {
      return lot;
    }

    if (lot.status !== "LIVE") {
      throw new LotNotClosableError();
    }

    if (new Date(lot.endAt) > new Date()) {
      throw new LotNotFinishedError();
    }

    const latestBid = await awardRepository.findLatestBid(
      lotId,
      transaction
    );

    lot.winnerId = latestBid ? latestBid.bidderId : null;
    lot.finalPrice = latestBid ? latestBid.amount : null;
    lot.status = "CLOSED";

    await awardRepository.saveLot(lot, transaction);

    return lot;
  });
}

// async function closeLot(lotId, auctioneerId) {
//     return awardRepository.transaction(async (transaction) => {
//         const lot = await awardRepository.findLotById(
//             lotId,
//             transaction,
//             true
//         );

//         if (!lot) {
//             throw new LotNotFoundError();
//         }

//         if (Number(lot.auctioneerId) !== Number(auctioneerId)) {
//             throw new LotPermissionError();
//         }

//         if (lot.status === "CLOSED") {
//             return lot;
//         }

//         if (lot.status !== "LIVE") {
//             throw new LotNotClosableError(
//                 "Somente lotes em andamento podem ser encerrados."
//             );
//         }

//         const now = new Date();
//         const endAt = new Date(lot.endAt);

//         if (now < endAt) {
//             throw new LotNotFinishedError();
//         }

//         const latestBid = await awardRepository.findLatestBid(
//             lot.id,
//             transaction
//         );

//         lot.winnerId = latestBid
//             ? latestBid.bidderId
//             : null;

//         lot.finalPrice = latestBid
//             ? latestBid.amount
//             : null;

//         lot.settledAt = now;
//         lot.status = "CLOSED";

//         await awardRepository.saveLot(lot, transaction);

//         return lot;
//     });
// }

async function getMyAwards(winnerId) {
    return awardRepository.findAwardsByWinnerId(winnerId);
}

async function getAwardByLotId(lotId, userId) {
    const lot = await awardRepository.findAwardByLotId(lotId);

    if (!lot) {
        throw new AwardNotFoundError();
    }

    const isWinner =
        Number(lot.winnerId) === Number(userId);

    const isAuctioneer =
        Number(lot.auctioneerId) === Number(userId);

    if (!isWinner && !isAuctioneer) {
        throw createError(
            "Você não tem permissão para consultar este arremate.",
            403
        );
    }

    return lot;
}

module.exports = {
    closeLot,
    getMyAwards,
    getAwardByLotId,
};
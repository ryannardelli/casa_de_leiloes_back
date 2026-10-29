const Bid = require("../models/Bid");
const Lot = require("../models/Lot");
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");

const sequelize = require("../configs/database");

module.exports = {
    transaction: (callback) =>
        sequelize.transaction(callback),

    findLotById: (lotId, transaction, lock = false) =>
        Lot.findByPk(lotId, {
            transaction,
            ...(lock && {
                lock: transaction.LOCK.UPDATE,
            }),
        }),

    findLatestBid: (lotId, transaction) =>
        Bid.findOne({
            where: { lotId },
            order: [
                ["createdAt", "DESC"],
                ["id", "DESC"],
            ],
            transaction,
        }),

    findAllBidsByLotId: (lotId) =>
        Bid.findAll({
            where: { lotId },
            include: [
                {
                    model: Lot,
                    as: "lot",
                    attributes: [
                        "id",
                        "title",
                        "imageUrl",
                        "currentPrice",
                        "status",
                    ],
                },
            ],
            order: [
                ["createdAt", "DESC"],
                ["id", "DESC"],
            ],
    }),

    findAllBidsByBidderId: (bidderId) =>
        Bid.findAll({
            where: { bidderId },
            include: [
                {
                    model: Lot,
                    as: "lot",
                    attributes: [
                        "id",
                        "title",
                        "imageUrl",
                        "currentPrice",
                        "status",
                    ],
                },
            ],
            order: [
                ["createdAt", "DESC"],
                ["id", "DESC"],
            ],
    }),

    findWalletByBidderId: (bidderId, transaction) =>
        Wallet.findOne({
            where: { userId: bidderId },
            transaction,
            lock: transaction.LOCK.UPDATE,
    }),

    countByBidder: (bidderId) =>
    Bid.count({
        where: { bidderId },
    }),

    countOngoingAuctionsByBidder: (bidderId) =>
        Lot.count({
            include: [
                {
                    model: Bid,
                    as: "bids",
                    where: { bidderId },
                    attributes: [],
                },
            ],
            where: {
                status: "LIVE",
            },
            distinct: true,
            col: "id",
        }),

        countWonLotsByBidder: (bidderId) =>
            Lot.count({
                where: {
                    winnerId: bidderId,
                    status: "CLOSED",
                },
            }),

        sumWonLotsByBidder: async (bidderId) => {
            const result = await Lot.sum("finalPrice", {
                where: {
                    winnerId: bidderId,
                    status: "CLOSED",
                },
            });

            return result || 0;
        },

    createBid: (data, transaction) =>
        Bid.create(data, { transaction }),

    createWalletTransaction: (data, transaction) =>
        WalletTransaction.create(data, { transaction }),

    saveWallet: (wallet, transaction) =>
        wallet.save({ transaction }),

    saveLot: (lot, transaction) =>
        lot.save({ transaction }),
};
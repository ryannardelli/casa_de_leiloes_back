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

    createBid: (data, transaction) =>
        Bid.create(data, { transaction }),

    createWalletTransaction: (data, transaction) =>
        WalletTransaction.create(data, { transaction }),

    saveWallet: (wallet, transaction) =>
        wallet.save({ transaction }),

    saveLot: (lot, transaction) =>
        lot.save({ transaction }),
};
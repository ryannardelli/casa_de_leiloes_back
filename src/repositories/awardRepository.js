const Lot = require("../models/Lot");
const Bid = require("../models/Bid");
const sequelize = require("../configs/database");

module.exports = {
    transaction: (callback) =>
        sequelize.transaction(callback),

    findLotById: (lotId, transaction, lock = false) =>
        Lot.findByPk(lotId, {
            transaction,
            ...(lock && transaction
                ? { lock: transaction.LOCK.UPDATE }
                : {}),
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

    findAwardsByWinnerId: (winnerId) =>
        Lot.findAll({
            where: {
                winnerId,
                status: "CLOSED",
            },
            order: [
                ["settledAt", "DESC"],
                ["id", "DESC"],
            ],
        }),

    findAwardByLotId: (lotId) =>
        Lot.findOne({
            where: {
                id: lotId,
                status: "CLOSED",
                winnerId: {
                    [require("sequelize").Op.ne]: null,
                },
            },
        }),

    saveLot: (lot, transaction) =>
        lot.save({ transaction }),
};
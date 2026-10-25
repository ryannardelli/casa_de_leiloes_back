const WalletTransaction = require("../models/WalletTransaction");
const Wallet = require("../models/Wallet");

module.exports = {
    findByBidderId: (bidderId) =>
        Wallet.findOne({
            where: { userId: bidderId },
        }),

    create: (data) => Wallet.create(data),

    createTransaction: (data) => WalletTransaction.create(data),

    findAllTransactions: (walletId) =>
        WalletTransaction.findAll({
            where: { walletId },
            order: [["createdAt", "DESC"]],
        }),

    findTransactionById: (transactionId, walletId) =>
        WalletTransaction.findOne({
            where: { id: transactionId, walletId },
        }),

    save: (wallet) => wallet.save(),
};

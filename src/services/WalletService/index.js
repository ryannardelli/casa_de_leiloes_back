const WalletTransaction = require('../../models/WalletTransaction');
const Wallet = require('../../models/Wallet');

const WalletTransactionNotFoundError = require('../../exceptions/domain/wallet/WalletTransactionNotFoundError');

async function getWalletBalance(bidderId) {
    let wallet = await Wallet.findOne({ where: { bidderId } });

    if (!wallet) {
        wallet = await Wallet.create({ bidderId, totalBalance: 0, committedBalance: 0, availableBalance: 0 });
    }

    return {
        total: wallet.totalBalance,
        committed: wallet.committedBalance,
        available: wallet.availableBalance
    };
}

async function deposit(bidderId, amount) {
    let wallet = await Wallet.findOne({ where: { bidderId } });
    if (!wallet) {
        wallet = await Wallet.create({ bidderId, totalBalance: 0, committedBalance: 0, availableBalance: 0 });
    }

    const transaction = await WalletTransaction.create({
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount
    });

    wallet.totalBalance = Number(wallet.totalBalance) + Number(amount);
    wallet.availableBalance = Number(wallet.availableBalance) + Number(amount);
    await wallet.save();

    return transaction;
}

async function getTransactions(bidderId, queryParams) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const offset = (page - 1) * limit;

    const wallet = await Wallet.findOne({ where: { bidderId } });
    if (!wallet) {
        return { data: [], pagination: { totalItems: 0, totalPages: 0, currentPage: page, limit } };
    }

    const { count, rows } = await WalletTransaction.findAndCountAll({
        where: { walletId: wallet.id },
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });

    return {
        data: rows,
        pagination: {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit
        }
    };
}

async function getTransactionById(bidderId, transactionId) {
    const wallet = await Wallet.findOne({ where: { bidderId } });
    if (!wallet) {
        throw new WalletTransactionNotFoundError();
    }

    const transaction = await WalletTransaction.findOne({
        where: { id: transactionId, walletId: wallet.id }
    });

    if (!transaction) {
        throw new WalletTransactionNotFoundError();
    }

    return transaction;
}

module.exports = {
    getWalletBalance,
    deposit,
    getTransactions,
    getTransactionById
};
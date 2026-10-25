const WalletRepository = require('../../repositories/walletRepository');

const WalletTransactionNotFoundError = require('../../exceptions/domain/wallet/WalletTransactionNotFoundError');
const walletRepository = require('../../repositories/walletRepository');

async function getWalletBalance(bidderId) {
    let wallet = await walletRepository.findByBidderId(bidderId);

    if (!wallet) {
        wallet = await walletRepository.create({
            bidderId,
            totalBalance: 0,
            committedBalance: 0,
            availableBalance: 0
        });
    }

    return {
        total: wallet.totalBalance,
        committed: wallet.committedBalance,
        available: wallet.availableBalance
    };
}

async function deposit(bidderId, amount) {
    let wallet = await walletRepository.findByBidderId(bidderId);

    if (!wallet) {
        wallet = await walletRepository.create({
            bidderId,
            totalBalance: 0,
            committedBalance: 0,
            availableBalance: 0
        });
    }

    const transaction = await walletRepository.createTransaction({
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount
    });

    wallet.totalBalance = Number(wallet.totalBalance) + Number(amount);
    wallet.availableBalance = Number(wallet.availableBalance) + Number(amount);

    await walletRepository.save(wallet);

    return transaction;
}

async function getTransactions(bidderId) {
    const wallet = await walletRepository.findByBidderId(bidderId);

    if (!wallet) {
        return [];
    }

    return await walletRepository.findAllTransactions(wallet.id);
}

async function getTransactionById(bidderId, transactionId) {
    const wallet = await walletRepository.findByBidderId(bidderId);

    if (!wallet) {
        throw new WalletTransactionNotFoundError();
    }

    const transaction = await walletRepository.findTransactionById(
        transactionId,
        wallet.id
    );

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

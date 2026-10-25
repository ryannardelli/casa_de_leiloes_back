const walletService = require('../services/WalletService');

async function getWallet(req, res, next) {
    try {
        const bidderId = req.user.id;
        const balance = await walletService.getWalletBalance(bidderId);
        
        return res.status(200).json(balance);
    } catch (err) {
        next(err);
    }
}

async function createDeposit(req, res, next) {
    try {
        const bidderId = req.user.id;
        const { amount } = req.body;

        const transaction = await walletService.deposit(bidderId, amount);

        return res.status(201).json({
            message: "Depósito realizado com sucesso!",
            data: transaction
        });
    } catch (err) {
        next(err);
    }
}

async function listTransactions(req, res, next) {
    try {
        const bidderId = req.user.id;
        const result = await walletService.getTransactions(bidderId, req.query);

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

async function findTransactionById(req, res, next) {
    try {
        const bidderId = req.user.id;
        const { id } = req.params;

        const transaction = await walletService.getTransactionById(bidderId, id);

        return res.status(200).json(transaction);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getWallet,
    createDeposit,
    listTransactions,
    findTransactionById
};
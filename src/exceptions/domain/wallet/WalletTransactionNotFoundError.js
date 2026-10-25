class WalletTransactionNotFoundError extends Error {
    constructor(message = "Transação não encontrada.") {
        super(message);
        this.name = 'WalletTransactionNotFoundError';
        this.statusCode = 404;
    }
}

module.exports = WalletTransactionNotFoundError;
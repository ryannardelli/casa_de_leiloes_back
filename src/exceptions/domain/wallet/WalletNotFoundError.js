class WalletNotFoundError extends Error {
    constructor() {
        super("Carteira não encontrada.");
        this.name = "WalletNotFoundError";
        this.statusCode = 400;
    }
}

module.exports = WalletNotFoundError;
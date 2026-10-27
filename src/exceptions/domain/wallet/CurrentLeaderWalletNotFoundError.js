class CurrentLeaderWalletNotFoundError extends Error {
    constructor() {
        super("Carteira do líder atual não encontrada.");
        this.name = "CurrentLeaderWalletNotFoundError";
        this.statusCode = 400;
    }
}

module.exports = CurrentLeaderWalletNotFoundError;
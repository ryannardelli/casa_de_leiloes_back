class LotInvalidStatusError extends Error {
    constructor() {
        super("O lote não pode mais ser alterado no estado atual.");
        this.name = 'LotInvalidStatusError';
        this.statusCode = 409;
    }
}

module.exports = LotInvalidStatusError;
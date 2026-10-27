class LotNotFoundError extends Error {
    constructor() {
        super("Lote não encontrado.");
        this.name = "LotNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = LotNotFoundError;
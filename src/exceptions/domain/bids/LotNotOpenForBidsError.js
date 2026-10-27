class LotNotOpenForBidsError extends Error {
    constructor() {
        super("O lote não está aberto para lances.");
        this.name = "LotNotOpenForBidsError";
        this.statusCode = 400;
    }
}

module.exports = LotNotOpenForBidsError;
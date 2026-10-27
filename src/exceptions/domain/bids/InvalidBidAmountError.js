class InvalidBidAmountError extends Error {
    constructor() {
        super("O valor do lance deve ser maior que zero.");
        this.name = "InvalidBidAmountError";
        this.statusCode = 400;
    }
}

module.exports = InvalidBidAmountError;
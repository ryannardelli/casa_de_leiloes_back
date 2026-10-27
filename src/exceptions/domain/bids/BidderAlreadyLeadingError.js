class BidderAlreadyLeadingError extends Error {
    constructor() {
        super("Você já é o líder atual e não pode enviar outro lance.");

        this.name = "BidderAlreadyLeadingError";
        this.statusCode = 400;
    }
}

module.exports = BidderAlreadyLeadingError;
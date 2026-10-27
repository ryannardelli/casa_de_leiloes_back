class MinimumBidNotMetError extends Error {
    constructor(minimumBid) {
        super(
            `O lance mínimo permitido é ${minimumBid.toFixed(2)}.`
        );

        this.name = "MinimumBidNotMetError";
        this.statusCode = 400;
    }
}

module.exports = MinimumBidNotMetError;
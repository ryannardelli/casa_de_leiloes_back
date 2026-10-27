class InsufficientBalanceError extends Error {
    constructor() {
        super(
            "Saldo disponível insuficiente para realizar este lance."
        );

        this.name = "InsufficientBalanceError";
        this.statusCode = 400;
    }
}

module.exports = InsufficientBalanceError;
class LotNotClosableError extends Error {
    constructor(message = "O lote não pode ser encerrado.") {
        super(message);

        this.name = "LotNotClosableError";
        this.statusCode = 400;
    }
}

module.exports = LotNotClosableError;
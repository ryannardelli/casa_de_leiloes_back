class LotNotFinishedError extends Error {
    constructor() {
        super("O leilão ainda não chegou ao horário de encerramento.");

        this.name = "LotNotFinishedError";
        this.statusCode = 400;
    }
}

module.exports = LotNotFinishedError;
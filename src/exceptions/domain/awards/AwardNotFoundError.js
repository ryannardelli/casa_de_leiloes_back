class AwardNotFoundError extends Error {
    constructor() {
        super("Arremate não encontrado.");

        this.name = "AwardNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = AwardNotFoundError;
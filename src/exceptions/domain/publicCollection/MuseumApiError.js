class MuseumApiError extends Error {
    constructor(message = "Não foi possível consultar a coleção do museu.") {
        super(message);
        this.name = "MuseumApiError";
        this.statusCode = 502;
    }
}

module.exports = MuseumApiError;
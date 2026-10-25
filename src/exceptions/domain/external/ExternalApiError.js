class ExternalApiError extends Error {
    constructor(message = "Não foi possível carregar os dados do item no momento. Tente novamente em instantes.") {
        super(message);
        this.name = 'ExternalApiError';
        this.statusCode = 502;
    }
}

module.exports = ExternalApiError;
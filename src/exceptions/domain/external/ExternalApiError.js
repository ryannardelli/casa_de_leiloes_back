class ExternalApiError extends Error {
    constructor(message = "Não foi possível conectar à API externa para buscar o item.") {
        super(message);
        this.name = 'ExternalApiError';
        this.statusCode = 502;
    }
}

module.exports = ExternalApiError;
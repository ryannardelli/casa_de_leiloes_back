class LotPermissionError extends Error {
    constructor() {
        super("Você não tem permissão para realizar esta ação neste lote.");
        this.name = 'LotPermissionError';
        this.statusCode = 403;
    }
}

module.exports = LotPermissionError;
class LotHasBidsError extends Error {
    constructor() {
        super("Não é possível cancelar um lote que já recebeu lances.");
        this.name = 'LotHasBidsError';
        this.statusCode = 409;
    }
}

module.exports = LotHasBidsError;
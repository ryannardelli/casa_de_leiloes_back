const lotService = require('../services/lotService');

async function create(req, res, next) {
    try {
        const auctioneerId = req.user.id;
        const { externalItemId, startingPrice, minimumIncrement, startAt, endAt } = req.body;

        const lot = await lotService.createLotFromExternalItem(
            auctioneerId, 
            externalItemId, 
            { startingPrice, minimumIncrement, startAt, endAt }
        );

        return res.status(201).json({ 
            message: "Lote criado com sucesso!",
            data: lot 
        });
    } catch (err) {
        next(err);
    }
}

async function findByAuctioneer(req, res, next) {
    try {
        const auctioneerId = req.user.id;
        const { status } = req.query;

        const lots = await lotService.getLotsByAuctioneer(
            auctioneerId,
            status
        );

        return res.status(200).json(lots);
    } catch (err) {
        next(err);
    }
}

async function findPublicLots(req, res, next) {
    try {
        const { status } = req.query;

        const lots = await lotService.getPublicLots(status);

        return res.status(200).json(lots);
    } catch (err) {
        next(err);
    }
}

async function findById(req, res, next) {
    try {
        const { id } = req.params;
        const lot = await lotService.getLotById(id);
        return res.status(200).json(lot);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { id } = req.params;
        const auctioneerId = req.user.id;
        
        const updatedLot = await lotService.updateLot(id, auctioneerId, req.body);
        return res.status(200).json({ 
            message: "Lote atualizado com sucesso!", 
            data: updatedLot 
        });
    } catch (err) {
        next(err);
    }
}

async function cancel(req, res, next) {
    try {
        const { id } = req.params;
        const auctioneerId = req.user.id;

        const result = await lotService.cancelLot(id, auctioneerId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    create,
    findByAuctioneer,
    findPublicLots,
    findById,
    update,
    cancel
};

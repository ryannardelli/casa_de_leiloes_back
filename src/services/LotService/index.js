const Lot = require('../../models/Lot');
const LotNotFoundError = require('../../exceptions/domain/lot/LotNotFoundError');
const LotPermissionError = require('../../exceptions/domain/lot/LotPermissionError');
const LotInvalidStatusError = require('../../exceptions/domain/lot/LotInvalidStatusError');
const LotHasBidsError = require('../../exceptions/domain/lot/LotHasBidsError');

const ExternalApiError = require('../../exceptions/domain/external/ExternalApiError');

async function createLotFromExternalItem(auctioneerId, externalItemId, lotData) {
    let externalItemData;
    try {
        externalItemData = {
            title: "Item Exemplo da API",
            description: "Descrição vinda da API externa",
            imageUrl: "https://example.com/image.jpg",
            attributes: { marca: "Exemplo", ano: 2026 }
        };
    } catch (error) {
        throw new ExternalApiError();
    }

    const newLot = await Lot.create({
        auctioneerId,
        externalItemId,
        title: externalItemData.title,
        description: externalItemData.description,
        imageUrl: externalItemData.imageUrl,
        attributes: externalItemData.attributes,
        startingPrice: lotData.startingPrice,
        minimumIncrement: lotData.minimumIncrement,
        startAt: lotData.startAt,
        endAt: lotData.endAt,
        status: "SCHEDULED"
    });

    return newLot;
}

async function getLotsByAuctioneer(auctioneerId) {
    return await Lot.findAll({
        where: { auctioneerId }
    });
}

async function getPublicLots() {
    return await Lot.findAll({
        where: {
            status: {
                [require('sequelize').Op.ne]: 'CANCELLED'
            }
        }
    });
}

async function getLotById(id) {
    const lot = await Lot.findByPk(id);
    if (!lot) throw new LotNotFoundError();
    return lot;
}

async function updateLot(id, auctioneerId, updateData) {
    const lot = await getLotById(id);

    if (lot.auctioneerId !== auctioneerId) {
        throw new LotPermissionError();
    }

    if (lot.status === 'LIVE' || lot.status === 'CLOSED' || lot.status === 'CANCELLED') {
        throw new LotInvalidStatusError();
    }

    await lot.update(updateData);
    return lot.get({ plain: true });
}

async function cancelLot(id, auctioneerId) {
    const lot = await getLotById(id);

    if (lot.auctioneerId !== auctioneerId) {
        throw new LotPermissionError();
    }

    if (Number(lot.currentPrice) > 0) {
        throw new LotHasBidsError();
    }

    lot.status = "CANCELLED";
    await lot.save();

    return { message: "Lote cancelado com sucesso!" };
}

module.exports = {
    createLotFromExternalItem,
    getLotsByAuctioneer,
    getPublicLots,
    getLotById,
    updateLot,
    cancelLot
};
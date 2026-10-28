const Lot = require('../../models/Lot');
const LotNotFoundError = require('../../exceptions/domain/lot/LotNotFoundError');
const LotPermissionError = require('../../exceptions/domain/lot/LotPermissionError');
const LotInvalidStatusError = require('../../exceptions/domain/lot/LotInvalidStatusError');
const LotHasBidsError = require('../../exceptions/domain/lot/LotHasBidsError');

const ExternalApiError = require('../../exceptions/domain/external/ExternalApiError');

const { Op } = require("sequelize");

const awardService = require("../../services/awardService");

async function createLotFromExternalItem(
  auctioneerId,
  externalItemId,
  lotData
) {
  let externalItemData;

  try {
    const response = await fetch(
      `${process.env.EXTERNAL_API_BASE_URL}/objects/${externalItemId}`
    );

    if (!response.ok) {
      throw new ExternalApiError();
    }

    const item = await response.json();

    externalItemData = {
      title: item.title,
      description: item.objectDate
        ? `${item.objectDate} - ${item.medium || "Sem descrição"}`
        : item.medium || "Sem descrição",
      imageUrl: item.primaryImage || item.primaryImageSmall || null,
      attributes: {
        artist: item.artistDisplayName,
        department: item.department,
        culture: item.culture,
        objectDate: item.objectDate,
        medium: item.medium
      }
    };
  } catch (error) {
    if (error instanceof ExternalApiError) {
      throw error;
    }

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

async function getLotsByAuctioneer(auctioneerId, status) {
    const where = { auctioneerId };

    if (status) {
        where.status = status;
    }

    return await Lot.findAll({
        where
    });
}

async function getPublicLots(status) {
    const where = {};

    if (status) {
        where.status = status;
    } else {
        where.status = {
            [Op.ne]: "CANCELLED"
        };
    }

    return await Lot.findAll({
        where
    });
}

async function getLotById(id) {
    const lot = await Lot.findByPk(id);
    if (!lot) throw new LotNotFoundError();
    return lot;
}

async function updateScheduledLotsStatus() {
    const now = new Date();

    const [updatedCount] = await Lot.update(
        {
            status: "LIVE"
        },
        {
            where: {
                status: "SCHEDULED",
                startAt: {
                    [Op.lte]: now
                },
                endAt: {
                    [Op.gt]: now
                }
            }
        }
    );

    return updatedCount;
}

async function updateScheduledLotsStatus() {
    const now = new Date();

    const [updatedCount] = await Lot.update(
        {
            status: "LIVE"
        },
        {
            where: {
                status: "SCHEDULED",
                startAt: {
                    [Op.lte]: now
                },
                endAt: {
                    [Op.gt]: now
                }
            }
        }
    );

    return updatedCount;
}

async function updateScheduledLotsStatus() {
    const now = new Date();

    const [updatedCount] = await Lot.update(
        {
            status: "LIVE"
        },

        {
            where: {
                status: "SCHEDULED",
                startAt: {
                    [Op.lte]: now
                },
                endAt: {
                    [Op.gt]: now
                }
            }
        }
    );

    return updatedCount;
}

async function updateExpiredLotsStatus() {
  const now = new Date();

  const expiredLots = await Lot.findAll({
    attributes: ["id"],
    where: {
      status: "LIVE",
      endAt: {
        [Op.lte]: now,
      },
    },
  });

  let updatedCount = 0;

  for (const lot of expiredLots) {
    try {
      await awardService.closeLot(lot.id);
      updatedCount++;
    } catch (error) {
      console.error(
        `Erro ao encerrar o lote ${lot.id}:`,
        error.message
      );
    }
  }

  return updatedCount;
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
    updateExpiredLotsStatus,
    updateScheduledLotsStatus,
    getLotById,
    updateLot,
    cancelLot
};
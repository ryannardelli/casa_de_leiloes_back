const awardService = require("../services/awardService");
const { toAwardDto } = require("../dtos/award/toAwardDto");

async function closeLot(req, res, next) {
    try {
        const { lotId } = req.params;
        const auctioneerId = req.user.id;

        const lot = await awardService.closeLot(
            lotId,
            auctioneerId
        );

        return res.status(200).json({
            message: "Lote encerrado com sucesso.",
            award: toAwardDto(lot),
        });
    } catch (error) {
        next(error);
    }
}

async function listMyAwards(req, res, next) {
    try {
        const winnerId = req.user.id;

        const lots = await awardService.getMyAwards(winnerId);

        return res.status(200).json(
            lots.map(toAwardDto)
        );
    } catch (error) {
        next(error);
    }
}

async function getAwardByLotId(req, res, next) {
    try {
        const { lotId } = req.params;
        const userId = req.user.id;

        const lot = await awardService.getAwardByLotId(
            lotId,
            userId
        );

        return res.status(200).json(
            toAwardDto(lot)
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    closeLot,
    listMyAwards,
    getAwardByLotId,
};
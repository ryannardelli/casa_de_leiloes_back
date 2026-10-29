const { toBidderStatsDto } = require("../dtos/dashboard/toBidderStatsDto");
const { toAuctioneerStatsDto } = require("../dtos/dashboard/toAuctioneerStatsDto");
const dashboardService = require("../services/dashboardService");

async function getBidderStats(req, res, next) {
    try {
        const bidderId = req.user.id;

        const stats = await dashboardService.getBidderStats(bidderId);

        return res.status(200).json(toBidderStatsDto(stats));

    } catch (err) {
        next(err);
    }
}

async function getAuctioneerStats(req, res, next) {
    try {
        const auctioneerId = req.user.id;
        const stats = await dashboardService.getAuctioneerStats(auctioneerId);

        return res.status(200).json(toAuctioneerStatsDto(stats));
    } catch (err) {
        next(err);
    }
}

module.exports = { getBidderStats, getAuctioneerStats };
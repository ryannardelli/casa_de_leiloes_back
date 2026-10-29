const { toBidderStatsDto } = require("../dtos/dashboard/toBidderStatsDto");
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

module.exports = { getBidderStats };
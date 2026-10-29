function toAuctioneerStatsDto(stats) {
    return {
        activeLots: stats.activeLots,
        totalBids: stats.totalBids,
        closedAuctions: stats.closedAuctions,
        totalAmountRaised: stats.totalAmountRaised
    };
}

module.exports = { toAuctioneerStatsDto };
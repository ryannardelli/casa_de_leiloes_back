function toBidderStatsDto(stats) {
    return {
        totalBids: stats.totalBids,
        ongoingAuctions: stats.ongoingAuctions,
        wonLots: stats.wonLots,
        totalAmountWon: stats.totalAmountWon
    };
}

module.exports = { toBidderStatsDto };
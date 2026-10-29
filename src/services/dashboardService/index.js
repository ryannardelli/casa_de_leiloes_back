const UserNotFoundError = require("../../exceptions/domain/users/UserNotFoundError");
const bidRepository = require("../../repositories/bidRepository");

async function getBidderStats(userId) {
    if (!userId) throw new UserNotFoundError();

    const totalBids = await bidRepository.countByBidder(userId);
    const ongoingAuctions = await bidRepository.countOngoingAuctionsByBidder(userId);
    const wonLots = await bidRepository.countWonLotsByBidder(userId);
    const totalAmountWon = await bidRepository.sumWonLotsByBidder(userId);

    return {
        totalBids,
        ongoingAuctions,
        wonLots,
        totalAmountWon: totalAmountWon || 0
    };
}

async function getAuctioneerStats(auctioneerId) {
    if (!auctioneerId) throw new UserNotFoundError();

    const activeLots =
        await bidRepository.countActiveLotsByAuctioneer(auctioneerId);

    const totalBids =
        await bidRepository.countBidsByAuctioneer(auctioneerId);

    const closedAuctions =
        await bidRepository.countClosedAuctionsByAuctioneer(auctioneerId);

    const totalAmountRaised =
        await bidRepository.sumAmountRaisedByAuctioneer(auctioneerId);

    return {
        activeLots,
        totalBids,
        closedAuctions,
        totalAmountRaised: totalAmountRaised || 0,
    };
}


module.exports = { getBidderStats, getAuctioneerStats };
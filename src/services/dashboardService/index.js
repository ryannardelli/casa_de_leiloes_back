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

module.exports = { getBidderStats };
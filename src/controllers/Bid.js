const bidService = require("../services/bidService");

const { toBidDto } = require("../dtos/bid/toBidDto");
const { toLiveRoomDto } = require("../dtos/bid/toLiveRoomDto");

async function createBid(req, res, next) {
    try {
        const { lotId } = req.params;
        const { amount, requestId } = req.body;
        const bidderId = req.user.id;

        const bid = await bidService.createBid(
            lotId,
            bidderId,
            amount,
            requestId
        );

        const liveRoom = await bidService.getLiveRoom(lotId);

        const io = req.app.get("io");

        io.to(`lot:${Number(lotId)}`).emit("bid:updated", {
            bid: {
                id: bid.id,
                lotId: bid.lotId,
                amount: Number(bid.amount),
                createdAt: bid.createdAt,
                status: "ACCEPTED",
            },
            
            lot: {
                status: liveRoom.status,
                currentPrice: liveRoom.currentPrice,
                minimumNextBid: liveRoom.nextMinimumBid,
                endAt: liveRoom.endAt,
                totalBids: liveRoom.totalBids,
            },
        });

        return res.status(201).json({
            message: "Lance realizado com sucesso!",
            bid: {
                id: bid.id,
                lotId: bid.lotId,
                amount: Number(bid.amount),
                createdAt: bid.createdAt,
                status: "ACCEPTED",
            },
        });
    } catch (error) {
        next(error);
    }
}

async function listBidsByLotId(req, res, next) {
    try {
    const { lotId } = req.params;

        const bids = await bidService.getBidsByLotId(lotId);

        return res.status(200).json(
            bids.map(toBidDto)
        );
    } catch (err) {
        next(err);
    }

}

async function listMyBids(req, res, next) {
    try {
    const bidderId = req.user.id;

        const bids = await bidService.getMyBids(bidderId);

        return res.status(200).json(
            bids.map(toBidDto)
        );
    } catch (err) {
        next(err);
    }

}

async function getLiveRoom(req, res, next) {
    try {
    const { lotId } = req.params;
    const bidderId = req.user?.id || null;

        const liveRoom = await bidService.getLiveRoom(
            lotId,
            bidderId
        );

        return res.status(200).json(
            toLiveRoomDto(liveRoom)
        );
    } catch (err) {
        next(err);
    }

}

module.exports = {
    createBid,
    listBidsByLotId,
    listMyBids,
    getLiveRoom,
};
const bidService = require("../services/bidService");

const { toBidDto } = require("../dtos/bid/toBidDto");
const { toLiveRoomDto } = require("../dtos/bid/toLiveRoomDto");

async function createBid(req, res, next) {
  try {
    const { lotId } = req.params;
    const { amount, requestId } = req.body;
    const bidderId = req.user.id;

    const result = await bidService.createBid(
      lotId,
      bidderId,
      amount,
      requestId
    );

    const { bid, previousLeader, lot } = result;

    const liveRoom = await bidService.getLiveRoom(lotId);
    const io = req.app.get("io");

    const bidPayload = {
      id: bid.id,
      lotId: bid.lotId,
      bidderId: Number(bid.bidderId),
      amount: Number(bid.amount),
      createdAt: bid.createdAt,
      status: "ACCEPTED",
    };

    io.to(`lot:${Number(lotId)}`).emit("bid:updated", {
      bid: bidPayload,
      lot: {
        status: liveRoom.status,
        currentPrice: liveRoom.currentPrice,
        minimumNextBid: liveRoom.nextMinimumBid,
        endAt: liveRoom.endAt,
        totalBids: liveRoom.totalBids,
      },
    });

    io.to(`user:${Number(bid.bidderId)}`).emit(
      "bid:leading",
      {
        lotId: Number(lotId),
        lotTitle: lot?.title,
        currentAmount: Number(bid.amount),
        message: "Você está ganhando este leilão!",
      }
    );

    if (
      previousLeader &&
      Number(previousLeader.bidderId) !== Number(bid.bidderId)
    ) {
      io.to(`user:${Number(previousLeader.bidderId)}`).emit(
        "bid:outbid",
        {
          lotId: Number(lotId),
          lotTitle: lot?.title,
          previousAmount: Number(previousLeader.amount),
          currentAmount: Number(bid.amount),
          message: "Seu lance foi superado!",
        }
      );
    }

    return res.status(201).json({
      message: "Lance realizado com sucesso!",
      bid: bidPayload,
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
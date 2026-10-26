function toLiveRoomDto(liveRoom) {
    return {
        lotId: liveRoom.lotId,
        status: liveRoom.status,
        startingPrice: liveRoom.startingPrice,
        minimumIncrement: liveRoom.minimumIncrement,
        currentPrice: liveRoom.currentPrice,
        nextMinimumBid: liveRoom.nextMinimumBid,
        startAt: liveRoom.startAt,
        endAt: liveRoom.endAt,
        remainingTime: liveRoom.remainingTime,
        isOpen: liveRoom.isOpen,
        currentLeaderId: liveRoom.currentLeaderId,
        isLeading: liveRoom.isLeading,
        position: liveRoom.position,
        totalBids: liveRoom.totalBids,
    };
}

module.exports = { toLiveRoomDto };
function toBidDto(bid) {
    return {
        id: bid.id,
        lotId: bid.lotId,
        bidderId: bid.bidderId,
        amount: Number(bid.amount),
        previousHash: bid.previousHash,
        hash: bid.hash,
        createdAt: bid.createdAt,
    };
}

module.exports = { toBidDto };
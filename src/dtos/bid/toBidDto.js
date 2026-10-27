// function toBidDto(bid) {
//     return {
//         id: bid.id,
//         lotId: bid.lotId,
//         bidderId: bid.bidderId,
//         amount: Number(bid.amount),
//         previousHash: bid.previousHash,
//         hash: bid.hash,
//         createdAt: bid.createdAt,
//     };
// }

// module.exports = { toBidDto };

function toBidDto(bid) {
    return {
        id: bid.id,
        lotId: bid.lotId,
        bidderId: bid.bidderId,
        amount: Number(bid.amount),
        previousHash: bid.previousHash,
        hash: bid.hash,
        createdAt: bid.createdAt,

        lot: bid.lot ? {
            title: bid.lot.title,
            imageUrl: bid.lot.imageUrl,
            currentPrice: Number(bid.lot.currentPrice),
            status: bid.lot.status,
        } : null,
    };
}

module.exports = { toBidDto };
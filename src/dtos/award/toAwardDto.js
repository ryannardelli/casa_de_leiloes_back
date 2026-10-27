function toAwardDto(lot) {
    return {
        lotId: lot.id,
        title: lot.title,
        description: lot.description,
        imageUrl: lot.imageUrl,

        winnerId: lot.winnerId,
        finalPrice: lot.finalPrice !== null
            ? Number(lot.finalPrice)
            : null,

        status: lot.status,
        endAt: lot.endAt,
        settledAt: lot.settledAt,
    };
}

module.exports = { toAwardDto };
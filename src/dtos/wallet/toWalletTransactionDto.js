function toWalletTransactionDto(transaction) {
    return {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        createdAt: transaction.createdAt
    };
}

module.exports = { toWalletTransactionDto };

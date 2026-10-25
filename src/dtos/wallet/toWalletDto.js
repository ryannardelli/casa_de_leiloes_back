function toWalletDto(wallet) {
    return {
        total: wallet.total,
        committed: wallet.committed,
        available: wallet.available
    };
}

module.exports = { toWalletDto };
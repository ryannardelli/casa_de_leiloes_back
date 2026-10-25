function toWalletDto(wallet) {
    return {
        total: wallet.totalBalance,
        committed: wallet.committedBalance,
        available: wallet.availableBalance
    };
}

module.exports = { toWalletDto };
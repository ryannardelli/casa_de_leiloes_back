const cron = require("node-cron");
const lotService = require("../services/LotService");

function startLotScheduler() {
    cron.schedule("* * * * * *", async () => {
        try {
            await lotService.updateScheduledLotsStatus();
            await lotService.updateExpiredLotsStatus();
        } catch (error) {
            console.error("Erro ao atualizar status dos lotes:", error);
        }
    });
}

module.exports = { startLotScheduler };
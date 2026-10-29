const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/Dashboard");
const { checkToken } = require("../middlewares/checkToken");

/**
 * @swagger
 * /dashboard/bidder/stats:
 *   get:
 *     summary: Retorna estatísticas do dashboard do licitante
 *     description: >
 *       Retorna métricas gerais do licitante autenticado, incluindo
 *       total de lances realizados, leilões em andamento com sua participação,
 *       lotes arrematados e valor total das arrematações.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do licitante retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBids:
 *                   type: integer
 *                   example: 24
 *                   description: Total de lances realizados pelo licitante
 *                 ongoingAuctions:
 *                   type: integer
 *                   example: 5
 *                   description: >
 *                     Total de leilões em andamento com participação
 *                     do licitante
 *                 wonLots:
 *                   type: integer
 *                   example: 3
 *                   description: Total de lotes arrematados pelo licitante
 *                 totalAmountWon:
 *                   type: number
 *                   format: double
 *                   example: 8450.00
 *                   description: Valor total dos lotes arrematados
 *       401:
 *         description: Token inválido ou ausente
 */
router.get(
  "/bidder/stats",
  checkToken,
  dashboardController.getBidderStats
);

module.exports = router;
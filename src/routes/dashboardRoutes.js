const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/Dashboard");
const { checkToken } = require("../middlewares/checkToken");
const authorize = require("../middlewares/authorize");

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
  authorize(["Licitante"]),
  dashboardController.getBidderStats
);

/**
 * @swagger
 * /dashboard/auctioneer/stats:
 *   get:
 *     summary: Retorna estatísticas do dashboard do leiloeiro
 *     description: >
 *       Retorna métricas gerais do leiloeiro autenticado, incluindo
 *       total de lotes ativos, lances recebidos nos seus lotes,
 *       leilões encerrados e valor total arrecadado com os arremates.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do leiloeiro retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activeLots:
 *                   type: integer
 *                   example: 12
 *                   description: Total de lotes disponíveis ou em andamento
 *                 totalBids:
 *                   type: integer
 *                   example: 248
 *                   description: Total de lances recebidos nos lotes do leiloeiro
 *                 closedAuctions:
 *                   type: integer
 *                   example: 36
 *                   description: Total de lotes com status CLOSED
 *                 totalAmountRaised:
 *                   type: number
 *                   format: double
 *                   example: 48750.00
 *                   description: Valor total dos arremates dos lotes encerrados com vencedor
 *       401:
 *         description: Token inválido ou ausente
 */
router.get(
  "/auctioneer/stats",
  checkToken,
  authorize(["Leiloeiro"]),
  dashboardController.getAuctioneerStats
);

module.exports = router;
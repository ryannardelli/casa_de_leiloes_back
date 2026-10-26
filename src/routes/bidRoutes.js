
const express = require("express");

const router = express.Router();

const bidController = require("../controllers/Bid");
const { checkToken } = require("../middlewares/checkToken");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * /bids/lots/{lotId}:
 *   post:
 *     summary: Enviar um lance para um lote
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lotId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1500.00
 *     responses:
 *       201:
 *         description: Lance registrado com sucesso
 *       400:
 *         description: Lance inválido ou saldo insuficiente
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Usuário não é licitante
 *       404:
 *         description: Lote não encontrado
 */
router.post(
    "/lots/:lotId",
    checkToken,
    authorize(["Licitante"]),
    bidController.createBid
);

/**
 * @swagger
 * /bids/lots/{lotId}:
 *   get:
 *     summary: Consultar o histórico de lances de um lote
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: lotId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico de lances retornado com sucesso
 *       404:
 *         description: Lote não encontrado
 */
router.get(
    "/lots/:lotId/bids",
    bidController.listBidsByLotId
);

/**
 * @swagger
 * /bids/bidder/my-bids:
 *   get:
 *     summary: Consultar os próprios lances
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lances retornados com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Usuário não é licitante
 */
router.get(
    "/bidder/my-bids",
    checkToken,
    authorize(["Licitante"]),
    bidController.listMyBids
);

/**
 * @swagger
 * /bids/lots/{lotId}/live:
 *   get:
 *     summary: Consultar o estado atual da sala do lote
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: lotId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estado da sala retornado com sucesso
 *       404:
 *         description: Lote não encontrado
 */
router.get(
    "/lots/:lotId/live",
    bidController.getLiveRoom
);

module.exports = router;
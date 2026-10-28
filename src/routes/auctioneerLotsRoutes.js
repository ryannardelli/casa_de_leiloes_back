const express = require("express");
const router = express.Router();

const lotController = require("../controllers/Lot");
const { checkToken } = require("../middlewares/checkToken");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * /auctioneer/lots:
 *   post:
 *     summary: Cria lote a partir de um item selecionado
 *     tags: [Auctioneer Lots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - externalItemId
 *               - startingPrice
 *               - minimumIncrement
 *               - startAt
 *               - endAt
 *             properties:
 *               externalItemId:
 *                 type: string
 *                 example: "EXT-98765"
 *               startingPrice:
 *                 type: number
 *                 format: float
 *                 example: 1500.00
 *               minimumIncrement:
 *                 type: number
 *                 format: float
 *                 example: 100.00
 *               startAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-01T10:00:00Z"
 *               endAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-01T18:00:00Z"
 *     responses:
 *       201:
 *         description: Lote criado com sucesso a partir da API externa
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       502:
 *         description: Erro na comunicação com a API externa
 */
router.post(
    "/lots",
    checkToken,
    authorize(["Leiloeiro"]),
    lotController.create
);

/**
 * @swagger
 * /auctioneer/lots:
 *   get:
 *     summary: Listar os lotes do leiloeiro autenticado
 *     tags: [Auctioneer Lots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [LIVE, CANCELLED, CLOSED]
 *         description: Filtra os lotes pelo status informado. Se omitido, retorna todos os lotes do leiloeiro.
 *         example: LIVE
 *     responses:
 *       200:
 *         description: Lista de lotes retornada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get(
    "/lots",
    checkToken,
    authorize(["Leiloeiro"]),
    lotController.findByAuctioneer
);

/**
 * @swagger
 * /auctioneer/lots/{id}:
 *   patch:
 *     summary: Editar lote próprio quando permitido
 *     tags: [Auctioneer Lots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do lote
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               startingPrice:
 *                 type: number
 *               minimumIncrement:
 *                 type: number
 *               startAt:
 *                 type: string
 *                 format: date-time
 *               endAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Lote atualizado com sucesso
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão para editar o lote
 *       404:
 *         description: Lote não encontrado
 *       409:
 *         description: Lote não pode ser alterado no estado atual
 */
router.patch(
    "/lots/:id",
    checkToken,
    authorize(["Leiloeiro"]),
    lotController.update
);

/**
 * @swagger
 * /auctioneer/lots/{id}/cancel:
 *   patch:
 *     summary: Cancelar lote que ainda não recebeu lances
 *     tags: [Auctioneer Lots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do lote
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lote cancelado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão para cancelar o lote
 *       404:
 *         description: Lote não encontrado
 *       409:
 *         description: Lote já recebeu lances ou não pode ser cancelado
 */
router.patch(
    "/lots/:id/cancel",
    checkToken,
    authorize(["Leiloeiro"]),
    lotController.cancel
);

module.exports = router;
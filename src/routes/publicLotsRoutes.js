const express = require("express");
const router = express.Router();

const lotController = require("../controllers/Lot")

/**
 * @swagger
 * /public-lots/lots:
 *   get:
 *     summary: Listar lotes públicos por status
 *     tags: [Public Lots]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, LIVE, CLOSED, CANCELLED]
 *         description: Filtrar lotes por status. Se omitido, retorna todos os lotes, exceto os cancelados.
 *     responses:
 *       200:
 *         description: Lista de lotes públicos
 */
router.get(
    "/lots",
    lotController.findPublicLots
);

/**
 * @swagger
 * /public-lots/lots/{id}:
 *   get:
 *     summary: Consultar os detalhes de um lote público
 *     tags: [Public Lots]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do lote
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do lote encontrados
 *       404:
 *         description: Lote não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
    "/lots/:id",
    lotController.findById
);

module.exports = router;
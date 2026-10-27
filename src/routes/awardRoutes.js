const express = require("express");

const router = express.Router();

const awardController = require("../controllers/Award");
const { checkToken } = require("../middlewares/checkToken");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Awards
 *   description: Operações relacionadas aos arremates
 */

/**
 * @swagger
 * /awards/me:
 *   get:
 *     summary: Consultar meus arremates
 *     description: Retorna os lotes encerrados que foram arrematados pelo usuário autenticado.
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Arremates retornados com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Usuário não é licitante
 */
router.get(
    "/me",
    checkToken,
    authorize(["Licitante"]),
    awardController.listMyAwards
);

/**
 * @swagger
 * /awards/{lotId}:
 *   get:
 *     summary: Consultar os detalhes de um arremate
 *     description: Permite ao vencedor ou ao leiloeiro responsável consultar o resultado do lote.
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lotId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do lote
 *     responses:
 *       200:
 *         description: Detalhes do arremate retornados com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem permissão para consultar o arremate
 *       404:
 *         description: Arremate não encontrado
 */
router.get(
    "/:lotId",
    checkToken,
    authorize(["Licitante", "Leiloeiro"]),
    awardController.getAwardByLotId
);

/**
 * @swagger
 * /awards/lots/{lotId}/close:
 *   post:
 *     summary: Encerrar um lote e registrar seu resultado
 *     description: Encerra um lote pertencente ao leiloeiro autenticado, desde que o horário de encerramento tenha sido atingido. O vencedor e o preço final são calculados pelo servidor.
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lotId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do lote
 *     responses:
 *       200:
 *         description: Lote encerrado com sucesso
 *       400:
 *         description: Lote ainda não pode ser encerrado ou não está em andamento
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Usuário não tem permissão para encerrar o lote
 *       404:
 *         description: Lote não encontrado
 */
router.post(
    "/lots/:lotId/close",
    checkToken,
    authorize(["Leiloeiro"]),
    awardController.closeLot
);

module.exports = router;
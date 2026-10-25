const express = require("express");
const router = express.Router();

const walletController = require("../controllers/Wallet");
const { checkToken } = require("../middlewares/checkToken");

/**
 * @swagger
 * /wallet:
 *   get:
 *     summary: Consultar saldo total, comprometido e disponível da carteira
 *     tags: [Bidder Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   format: float
 *                   example: 5000.00
 *                 committed:
 *                   type: number
 *                   format: float
 *                   example: 1200.00
 *                 available:
 *                   type: number
 *                   format: float
 *                   example: 3800.00
 *       401:
 *         description: Não autorizado
 */
router.get(
    "/",
    checkToken,
    walletController.getWallet
);

/**
 * @swagger
 * /wallet/deposits:
 *   post:
 *     summary: Realizar um depósito na carteira do bidder
 *     tags: [Bidder Wallet]
 *     security:
 *       - bearerAuth: []
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
 *                 format: float
 *                 example: 1000.00
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *       400:
 *         description: Valor do depósito inválido
 *       401:
 *         description: Não autorizado
 */
router.post(
    "/deposits",
    checkToken,
    walletController.createDeposit
);

/**
 * @swagger
 * /wallet/transactions:
 *   get:
 *     summary: Listar o extrato de transações da carteira
 *     tags: [Bidder Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Extrato paginado retornado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get(
    "/transactions",
    checkToken,
    walletController.listTransactions
);

/**
 * @swagger
 * /wallet/transactions/{id}:
 *   get:
 *     summary: Consultar os detalhes de uma transação específica
 *     tags: [Bidder Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da transação encontrados com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Transação não encontrada
 */
router.get(
    "/transactions/:id",
    checkToken,
    walletController.findTransactionById
);

module.exports = router;
const express = require("express");
const router = express.Router();

const profileController = require("../controllers/Profile");
const { checkToken } = require("../middlewares/checkToken");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * /profile/findAll:
 *   get:
 *     summary: Retorna todos os perfis
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de perfis encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get(
  "/findAll",
  checkToken,
  profileController.findAll
);

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Cria um novo perfil
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Barbeiro
 *               description:
 *                 type: string
 *                 example: Profissional responsável pelos atendimentos e gerenciamento da própria agenda.
 *               system:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Perfil criado com sucesso
 *       400:
 *         description: Dados inválidos ou ausentes
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.post(
  "/",
  checkToken,
  authorize(["admin"]),
  profileController.create
);

/**
 * @swagger
 * /profile/{id}:
 *   put:
 *     summary: Atualiza um perfil
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gerente
 *               description:
 *                 type: string
 *                 example: Responsável pelo gerenciamento do estabelecimento.
 *               system:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Perfil não encontrado
 */
router.put(
  "/:id",
  checkToken,
  authorize(["admin"]),
  profileController.update
);

/**
 * @swagger
 * /profile/{id}:
 *   get:
 *     summary: Retorna um perfil por ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Perfil não encontrado
 */
router.get(
  "/:id",
  checkToken,
  profileController.findById
);

/**
 * @swagger
 * /profile/{id}:
 *   delete:
 *     summary: Remove um perfil por ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *     responses:
 *       200:
 *         description: Perfil removido com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Perfil não encontrado
 */
router.delete(
  "/:id",
  checkToken,
  authorize(["admin"]),
  profileController.remove
);

/**
 * @swagger
 * /profile/associateMenu/{id}:
 *   patch:
 *     summary: Associa um menu a um perfil
 *     description: Associa um menu existente a um perfil.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do perfil
 *         schema:
 *           type: integer
 *           example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuId
 *             properties:
 *               menuId:
 *                 type: integer
 *                 description: ID do menu
 *                 example: 8
 *     responses:
 *       200:
 *         description: Menu associado ao perfil com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Perfil ou menu não encontrado
 */
router.patch(
  "/associateMenu/:id",
  checkToken,
  authorize(["admin"]),
  profileController.associateMenuToProfile
);

/**
 * @swagger
 * /profile/menus/{id}:
 *   get:
 *     summary: Retorna os menus associados a um perfil
 *     description: Retorna todos os menus habilitados para determinado perfil.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do perfil
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Lista de menus do perfil
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Perfil não encontrado
 */
router.get(
  "/menus/:id",
  checkToken,
  profileController.findMenusByProfile
);

module.exports = router;
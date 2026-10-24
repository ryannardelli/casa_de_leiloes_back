const express = require("express");
const router = express.Router();

const publicCollectionController = require("../controllers/PublicCollection");

/**
 * @swagger
 * tags:
 *   name: Public Collection
 *   description: Consulta pública de obras do acervo do museu
 */

/**
 * @swagger
 * /public/collections/featured:
 *   get:
 *     summary: Retorna obras em destaque
 *     tags: [Public Collection]
 *     responses:
 *       200:
 *         description: Obras retornadas com sucesso
 *       502:
 *         description: Falha ao consultar a API do museu
 */
router.get(
    "/collections/featured",
    publicCollectionController.getFeaturedWorks
);

/**
 * @swagger
 * /public/collections/curated:
 *   get:
 *     summary: Retorna obras para a curadoria
 *     tags: [Public Collection]
 *     responses:
 *       200:
 *         description: Obras retornadas com sucesso
 *       502:
 *         description: Falha ao consultar a API do museu
 */
router.get(
    "/collections/curated",
    publicCollectionController.getCuratedWorks
);

/**
 * @swagger
 * /public/collections/categories:
 *   get:
 *     summary: Retorna os departamentos do museu
 *     tags: [Public Collection]
 *     responses:
 *       200:
 *         description: Departamentos retornados com sucesso
 *       502:
 *         description: Falha ao consultar a API do museu
 */
router.get(
    "/collections/categories",
    publicCollectionController.getCategories
);

module.exports = router;
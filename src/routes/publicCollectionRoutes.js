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
 *     summary: Retorna obras selecionadas para os destaques
 *     tags: [Public Collection]
 *     responses:
 *       200:
 *         description: Obras em destaque retornadas com sucesso
 *       502:
 *         description: Falha ao consultar a API do museu
 */
router.get(
    "/collections/featured",
    publicCollectionController.getFeaturedWorks
);

/**
 * @swagger
 * /public/collections/japanese:
 *   get:
 *     summary: Retorna obras de arte japonesa
 *     tags: [Public Collection]
 *     responses:
 *       200:
 *         description: Obras japonesas retornadas com sucesso
 *       502:
 *         description: Falha ao consultar a API do museu
 */
router.get(
    "/collections/japanese",
    publicCollectionController.getJapaneseWorks
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

/**
 * @swagger
 * /public/external-items/search:
 *   get:
 *     summary: Pesquisa obras na API externa do museu
 *     tags: [Public Collection]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo utilizado para pesquisar as obras
 *     responses:
 *       200:
 *         description: Obras encontradas com sucesso
 *       502:
 *         description: Falha ao consultar a API externa do museu
 */
router.get(
    "/external-items/search",
    publicCollectionController.searchExternalItems
);

module.exports = router;
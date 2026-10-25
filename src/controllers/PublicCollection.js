const publicCollectionService = require("../services/publicCollectionService");

async function getJapaneseWorks(_req, res, next) {
    try {
        const works = await publicCollectionService.getJapaneseWorks();

        return res.status(200).json(works);
    } catch (err) {
        next(err);
    }
}

async function getCuratedWorks(_req, res, next) {
    try {
        const works = await publicCollectionService.getCuratedWorks();

        return res.status(200).json(works);
    } catch (err) {
        next(err);
    }
}

async function getCategories(_req, res, next) {
    try {
        const categories = await publicCollectionService.getCategories();

        return res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
}

async function searchExternalItems(req, res, next) {
    try {
        const items = await publicCollectionService.searchExternalItems(req.query.q);

        return res.status(200).json({
            total: items.length,
            items
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getJapaneseWorks,
    getCuratedWorks,
    getCategories,
    searchExternalItems
};
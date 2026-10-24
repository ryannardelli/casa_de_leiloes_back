const publicCollectionService = require("../services/publicCollectionService");

async function getFeaturedWorks(_req, res, next) {
    try {
        const works = await publicCollectionService.getFeaturedWorks();

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

module.exports = {
    getFeaturedWorks,
    getCuratedWorks,
    getCategories
};
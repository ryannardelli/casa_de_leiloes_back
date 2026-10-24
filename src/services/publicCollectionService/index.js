const MuseumApiError = require("../../exceptions/domain/publicCollection/MuseumApiError");

async function getFeaturedWorks() {
    try {
        const response = await fetch(
            `${process.env.EXTERNAL_API_SEARCH_URL}/search?q=Japanese&hasImages=true&limit=30`
        );

        if (!response.ok) throw new MuseumApiError();

        const data = await response.json();

        if (!data.objectIDs) return [];

        const works = await Promise.all(
            data.objectIDs.map(async (id) => {
                const response = await fetch(
                    `${process.env.EXTERNAL_API_BASE_URL}/objects/${id}`
                );

                if (!response.ok) return null;

                const work = await response.json();

                if (!work.primaryImageSmall && !work.primaryImage) return null;

                return {
                    id: work.objectID,
                    title: work.title,
                    artist: work.artistDisplayName,
                    category: work.classification,
                    image: work.primaryImageSmall || work.primaryImage,
                    date: work.objectDate,
                    department: work.department
                };
            })
        );

        return works.filter((work) => work).slice(0, 8);
    } catch (err) {
        if (err instanceof MuseumApiError) throw err;

        throw new MuseumApiError();
    }
}

async function getCuratedWorks() {
    try {
        const response = await fetch(
            `${process.env.EXTERNAL_API_SEARCH_URL}/search?q=Japanese&hasImages=true&limit=20`
        );

        if (!response.ok) throw new MuseumApiError();

        const data = await response.json();

        if (!data.objectIDs) return [];

        const works = await Promise.all(
            data.objectIDs.map(async (id) => {
                try {
                    const response = await fetch(
                        `${process.env.EXTERNAL_API_BASE_URL}/objects/${id}`
                    );

                    if (!response.ok) return null;

                    const work = await response.json();

                    const image = work.primaryImageSmall || work.primaryImage;

                    if (!image) return null;

                    return {
                        id: work.objectID,
                        title: work.title,
                        artist: work.artistDisplayName,
                        category: work.classification,
                        image,
                        date: work.objectDate,
                        department: work.department
                    };
                } catch {
                    return null;
                }
            })
        );

        return works.filter((work) => work).slice(0, 8);
    } catch (err) {
        if (err instanceof MuseumApiError) throw err;

        throw new MuseumApiError();
    }
}

async function getCategories() {
    try {
        const response = await fetch(
            `${process.env.EXTERNAL_API_BASE_URL}/departments`
        );

        if (!response.ok) throw new MuseumApiError();

        const data = await response.json();

        return data.departments.map((department) => ({
            id: department.departmentId,
            name: department.displayName
        }));
    } catch (err) {
        if (err instanceof MuseumApiError) throw err;

        throw new MuseumApiError();
    }
}

module.exports = {
    getFeaturedWorks,
    getCuratedWorks,
    getCategories
};
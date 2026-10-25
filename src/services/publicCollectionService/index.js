const MuseumApiError = require("../../exceptions/domain/publicCollection/MuseumApiError");
const ExternalApiError = require("../../exceptions/domain/external/ExternalApiError");

let japaneseWorksCache = null;
let japaneseWorksCacheExpiresAt = 0;

let featuredWorksCache = null;
let featuredWorksCacheExpiresAt = 0;

let curatedWorksCache = null;
let curatedWorksCacheExpiresAt = 0;

async function getJapaneseWorks() {
    if (japaneseWorksCache && Date.now() < japaneseWorksCacheExpiresAt) {
        return japaneseWorksCache;
    }

    try {
        const response = await fetch(
            `${process.env.EXTERNAL_API_SEARCH_URL}/search?q=Japanese&hasImages=true&limit=30`
        );

        if (!response.ok) throw new MuseumApiError();

        const data = await response.json();

        if (!data.objectIDs) {
            japaneseWorksCache = [];
            japaneseWorksCacheExpiresAt = Date.now() + 30 * 60 * 1000;
            return japaneseWorksCache;
        }

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

        japaneseWorksCache = works.filter((work) => work).slice(0, 8);
        japaneseWorksCacheExpiresAt = Date.now() + 30 * 60 * 1000;

        return japaneseWorksCache;
    } catch (err) {
        if (err instanceof MuseumApiError) throw err;

        throw new MuseumApiError();
    }
}

async function getCuratedWorks() {
    if (curatedWorksCache && Date.now() < curatedWorksCacheExpiresAt) {
        return curatedWorksCache;
    }

    try {
        const response = await fetch(
            `${process.env.EXTERNAL_API_SEARCH_URL}/search?q=painting&hasImages=true&limit=30`
        );

        if (!response.ok) throw new MuseumApiError();

        const data = await response.json();

        if (!data.objectIDs) {
            curatedWorksCache = [];
            curatedWorksCacheExpiresAt = Date.now() + 30 * 60 * 1000;
            return curatedWorksCache;
        }

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

        curatedWorksCache = works.filter((work) => work).slice(0, 8);
        curatedWorksCacheExpiresAt = Date.now() + 30 * 60 * 1000;

        return curatedWorksCache;
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

async function getFeaturedWorks() {
    if (featuredWorksCache && Date.now() < featuredWorksCacheExpiresAt) {
        return featuredWorksCache;
    }

    try {
       const response = await fetch(
         `${process.env.EXTERNAL_API_SEARCH_URL}/search?isHighlight=true&hasImages=true`
        );

        if (!response.ok) throw new MuseumApiError();

        const data = await response.json();

        if (!data.objectIDs || data.objectIDs.length === 0) {
            featuredWorksCache = [];
            featuredWorksCacheExpiresAt = Date.now() + 30 * 60 * 1000;

            return featuredWorksCache;
        }

        const objectIds = data.objectIDs.slice(0, 20);

        const works = await Promise.all(
            objectIds.map(async (id) => {
                const response = await fetch(
                    `${process.env.EXTERNAL_API_BASE_URL}/objects/${id}`
                );

                if (!response.ok) return null;

                const work = await response.json();

                if (!work.primaryImageSmall && !work.primaryImage) return null;

                return {
                    externalItemId: work.objectID,
                    title: work.title,
                    artist: work.artistDisplayName,
                    category: work.classification,
                    imageUrl: work.primaryImageSmall || work.primaryImage,
                    objectDate: work.objectDate,
                    department: work.department
                };
            })
        );

        featuredWorksCache = works.filter((work) => work);
        featuredWorksCacheExpiresAt = Date.now() + 30 * 60 * 1000;

        return featuredWorksCache;
    } catch (err) {
        if (err instanceof MuseumApiError) throw err;

        throw new MuseumApiError();
    }
}

async function searchExternalItems(query) {
  try {
    const url = `${process.env.EXTERNAL_API_SEARCH_URL}/search?q=${encodeURIComponent(query)}&hasImages=true`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new ExternalApiError();
    }

    const data = await response.json();

    if (!data.objectIDs || data.objectIDs.length === 0) {
      return [];
    }

    const objectIds = data.objectIDs.slice(0, 10);

    const items = await Promise.all(
      objectIds.map(async (objectID) => {
        const itemResponse = await fetch(
          `${process.env.EXTERNAL_API_BASE_URL}/objects/${objectID}`
        );

        if (!itemResponse.ok) {
          throw new ExternalApiError();
        }

        const item = await itemResponse.json();

        return {
          externalItemId: item.objectID,
          title: item.title,
          artist: item.artistDisplayName,
          objectDate: item.objectDate,
          imageUrl: item.primaryImageSmall || item.primaryImage || null,
          department: item.department,
          medium: item.medium
        };
      })
    );

    return items;
  } catch (error) {
    if (error instanceof ExternalApiError) {
      throw error;
    }

    throw new ExternalApiError();
  }
}

module.exports = {
  searchExternalItems
};

module.exports = {
    getJapaneseWorks,
    getCuratedWorks,
    getCategories,
    getFeaturedWorks,
    searchExternalItems
};
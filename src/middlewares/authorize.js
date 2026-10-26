const AccessDeniedError = require("../exceptions/common/AccessDeniedError");

function authorize(profiles = []) {
    if (typeof profiles === "string") {
        profiles = [profiles];
    }

    return (req, _res, next) => {
        const userProfile = req.user?.profile?.name;

        if (!profiles.includes(userProfile)) {
            throw new AccessDeniedError();
        }

        next();
    };
}

module.exports = authorize;
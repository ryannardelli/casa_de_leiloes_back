const Profile = require('../models/Profile');

module.exports = {
    findByName: (name) => Profile.findOne({ where: { name } }),
}
const User = require("../models/User");
const Profile = require("../models/Profile");

module.exports = {
  findAll: () => User.findAll({
    include: [{ model: Profile, as: 'Profile' }]
  }),

  findById: (id) => User.findByPk(id, {
    include: [{ model: Profile, as: 'Profile' }]
  }),

  findByEmail: (email) =>
    User.findOne({
      where: { email },
    }),

  create: (data) => User.create(data),

  update: (user, data) => user.update(data),

  delete: (user) => user.destroy(),

  save: (user) => user.save(),
};
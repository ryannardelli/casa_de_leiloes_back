const User = require("../models/User");

module.exports = {
  findAll: () => User.findAll(),

  findById: (id) => User.findByPk(id),

  findByEmail: (email) =>
    User.findOne({
      where: { email },
    }),

  create: (data) => User.create(data),

  update: (user, data) => user.update(data),

  delete: (user) => user.destroy(),

  save: (user) => user.save(),
};
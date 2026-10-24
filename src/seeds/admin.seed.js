const bcrypt = require("bcrypt");
const User = require("../models/User");

async function createInitialAdmin() {
  try {
    const existingAdmin = await User.findOne({
      where: {
        email: process.env.INITIAL_ADMIN_EMAIL,
      },
    });

    if (existingAdmin) {
      console.log("Usuário inicial já existe.");
      return;
    }

    const passwordHash = await bcrypt.hash(
      process.env.INITIAL_ADMIN_PASSWORD,
      10
    );

    await User.create({
      name: "Administrador",
      email: process.env.INITIAL_ADMIN_EMAIL,
      password: passwordHash,
      role: "admin",
    });

    console.log("Usuário inicial criado com sucesso.");
  } catch (error) {
    console.error("Erro ao criar usuário inicial:", error);
    throw error;
  }
}

module.exports = createInitialAdmin;
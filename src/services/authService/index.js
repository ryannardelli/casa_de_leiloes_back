const EmailAlreadyExistsError = require("../../exceptions/domain/auth/EmailAlreadyExistsError");
const InvalidEmailError = require("../../exceptions/domain/auth/InvalidEmailError");
const InvalidPasswordError = require("../../exceptions/domain/auth/InvalidPasswordError ");
const InvalidNameError = require("../../exceptions/domain/auth/InvalidNameError");
const InvalidCredentialsError = require("../../exceptions/domain/auth/InvalidCredentialsError");

const bcrypt = require("bcryptjs");
const UserNotFoundError = require("../../exceptions/domain/users/UserNotFoundError");

const jwt = require('jsonwebtoken');

const userRepository = require("../../repositories/userRepository");

async function createUser({ name, email, password }) {
  if (!name || name.length < 2) {
    throw new InvalidNameError();
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new InvalidEmailError();
  }

  if (!password || password.length < 6) {
    throw new InvalidPasswordError();
  }

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new EmailAlreadyExistsError();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    message: "Usuário criado com sucesso!",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

async function login({ email, password }) {
  if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();

  const user = await userRepository.findByEmail(email);
  if (!user) throw new UserNotFoundError();

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new InvalidCredentialsError();

  try {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      secret, 
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
      },
    };
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao gerar token");
  }
}

module.exports = { createUser, login };
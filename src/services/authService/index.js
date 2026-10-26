const EmailAlreadyExistsError = require("../../exceptions/domain/auth/EmailAlreadyExistsError");
const InvalidEmailError = require("../../exceptions/domain/auth/InvalidEmailError");
const InvalidPasswordError = require("../../exceptions/domain/auth/InvalidPasswordError ");
const InvalidNameError = require("../../exceptions/domain/auth/InvalidNameError");
const InvalidCredentialsError = require("../../exceptions/domain/auth/InvalidCredentialsError");

const bcrypt = require("bcrypt");
const UserNotFoundError = require("../../exceptions/domain/users/UserNotFoundError");

const jwt = require('jsonwebtoken');

const userRepository = require("../../repositories/userRepoistory");
const profileRepository = require("../../repositories/profileRepository");
const ProfileNotFoundError = require("../../exceptions/domain/profile/ProfileNotFoundError");


async function createUser({ name, email, password }) {
  if (!name || name.trim().length < 2) {
    throw new InvalidNameError();
  }

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    throw new InvalidEmailError();
  }

  if (!password || password.length < 6) {
    throw new InvalidPasswordError();
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await userRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    throw new EmailAlreadyExistsError();
  }

  const profile = await profileRepository.findByName("Licitante");

  if (!profile) {
    throw new ProfileNotFoundError();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    profileId: profile.id,
  });

  const token = jwt.sign(
    {
        id: user.id,
        email: user.email,
        profile: {
            id: profile.id,
            name: profile.name,
        },
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
      profile: profile.name,
    },
  };
}

async function login({ email, password }) {
  if (!/\S+@\S+\.\S+/.test(email)) throw new InvalidEmailError();

  const user = await userRepository.findByEmail(email);
  if (!user) throw new UserNotFoundError();

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new InvalidCredentialsError();

  const profile = await profileRepository.findById(user.profileId);
   if (!profile) throw new ProfileNotFoundError();

  try {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        profile: {
          id: profile.id,
          name: profile.name,
        },
      },
      secret,
      { expiresIn: "1h" }
    );
    // const token = jwt.sign(
    //   { id: user.id, email: user.email, role: user.role }, 
    //   secret, 
    //   { expiresIn: '1h' }
    // );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: profile
          ? {
              id: profile.id,
              name: profile.name,
            }
          : null,
      },
    };
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao gerar token");
  }
}

module.exports = { createUser, login };
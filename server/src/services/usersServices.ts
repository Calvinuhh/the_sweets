import { UserLogin, UserRegistration } from "../types/User";
import User from "../models/User";
import { hash, compare } from "bcrypt";
import { generateRandomToken } from "../utils/tokenGenerator";
import { sendn8nEmailRegistration } from "../utils/n8n";

export const register = async (userData: UserRegistration) => {
  const { name, lastname, email, password, country_code, phone } = userData;

  const user = await User.findOne({ email });

  if (user) throw Error("El usuario ya existe");

  const token = generateRandomToken();

  const newUser = await User.create({
    name,
    lastname,
    email,
    password: await hash(password, 10),
    country_code,
    phone,
    token,
  });

  try {
    await sendn8nEmailRegistration(email, name, token);
  } catch (error) {
    throw Error(`Error al enviar el email: ${error}`);
  }

  return newUser;
};

export const confirmRegistration = async (token: string, email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw Error("Usuario no encontrado");
  }

  if (user.active) {
    return "La cuenta ya está activada";
  }

  if (user.token !== token) {
    throw Error("Token inválido");
  }

  await User.findByIdAndUpdate(user._id, {
    active: true,
    token: null,
  });

  return "Cuenta activada correctamente";
};

export const login = async (userData: UserLogin) => {
  const { email, password } = userData;
};

export const getUserById = async (_id: string) => {};

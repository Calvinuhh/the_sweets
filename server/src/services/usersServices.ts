import { UserLogin, UserRegistration, UserUpdate } from "../types/User";
import User from "../models/User";
import { hash, compare } from "bcrypt";
import { generateRandomToken } from "../utils/tokenGenerator";
import {
  sendn8nEmailRegistration,
  sendn8nEmailContactForm,
} from "../utils/n8n";
import { sign } from "jsonwebtoken";

const { JWT_SECRET } = process.env as {
  JWT_SECRET: string;
};

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
    await User.findByIdAndDelete(newUser._id);
    throw error;
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

  const user = await User.findOne({ email });
  if (!user) throw Error("Credenciales incorrectas");

  if (!user.active)
    throw Error(
      "Usuario no activado. Por favor verifica tu correo electrónico"
    );

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) throw Error("Credenciales incorrectas");

  const token = sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      name: user.name,
      email: user.email,
      lastname: user.lastname,
      country_code: user.country_code,
      phone: user.phone,
    },
  };
};

export const getUserById = async (_id: string) => {
  const user = await User.findById(_id).select("-password -token -active");

  if (!user) throw Error("Usuario no encontrado");
  return user;
};

export const patchUserData = async (id: string, userData: UserUpdate) => {
  const { country_code, lastname, name, phone } = userData;

  const updateFields: Partial<UserUpdate> = {};

  if (name !== undefined) updateFields.name = name;
  if (lastname !== undefined) updateFields.lastname = lastname;
  if (country_code !== undefined) updateFields.country_code = country_code;
  if (phone !== undefined) updateFields.phone = phone;

  const user = await User.findById(id);
  if (!user) throw Error("Usuario no encontrado");

  const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
    new: true,
  }).select("-password -token -active");

  return updatedUser;
};

export const contactForm = async (
  firstName: string,
  lastName: string,
  countryCode: string,
  phone: string,
  email: string,
  message: string
) => {
  return await sendn8nEmailContactForm(
    firstName,
    lastName,
    countryCode,
    phone,
    email,
    message
  );
};

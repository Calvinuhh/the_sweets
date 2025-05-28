import { UserLogin, UserRegistration, UserUpdate } from "../types/User";
import User from "../models/User";
import { hash, compare } from "bcrypt";
import { generateRandomToken } from "../utils/tokenGenerator";
import {
  sendn8nEmailRegistration,
  sendn8nEmailContactForm,
} from "../utils/n8n";
import { sign } from "jsonwebtoken";
import { verifyGoogleToken } from "../config/googleAuth";

const { JWT_SECRET } = process.env as {
  JWT_SECRET: string;
};

export const register = async (userData: UserRegistration) => {
  const { name, lastname, email, password, country_code, phone } = userData;

  const user = await User.findOne({ email });

  if (user) throw Error("El usuario ya existe");

  if (!password) throw Error("El campo 'password' es requerido");
  if (!country_code) throw Error("El campo 'country_code' es requerido");

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
  if (!user) throw Error("Usuario no encontrado");

  if (!user.active)
    throw Error(
      "Usuario no activado. Por favor verifica tu correo electrónico"
    );

  if (!password) throw Error("El campo 'password' es requerido");
  if (!user.password) throw Error("El usuario no tiene contraseña establecida");

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

export const googleLogin = async (googleToken: string) => {
  const googleData = await verifyGoogleToken(googleToken);

  // Buscar usuario por Google ID
  let user = await User.findOne({ googleId: googleData.googleId });
  if (user && user.active) {
    const token = sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1h" });
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
  }

  // Buscar usuario por email
  user = await User.findOne({ email: googleData.email });
  if (user && user.active) {
    await User.findByIdAndUpdate(user._id, { googleId: googleData.googleId });
    const token = sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1h" });
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
  }

  // Usuario existe pero no está activo - verificar si ya tiene token
  if (user && !user.active) {
    // Si ya tiene un token, no enviar nuevo email
    if (user.token) {
      return {
        message:
          "Ya se ha enviado un correo de verificación previamente. Por favor revisa tu bandeja de entrada.",
        email: googleData.email,
        requiresVerification: true,
        tokenAlreadyExists: true,
      };
    }

    // Si no tiene token, generar uno nuevo y enviar email
    const verificationToken = generateRandomToken();
    await User.findByIdAndUpdate(user._id, {
      googleId: googleData.googleId,
      token: verificationToken,
    });

    try {
      if (!googleData.email) {
        throw new Error("El correo electrónico de Google no está disponible");
      }
      await sendn8nEmailRegistration(
        googleData.email,
        googleData.name,
        verificationToken
      );
    } catch (error) {
      // Revertir el token si falla el envío
      await User.findByIdAndUpdate(user._id, { token: null });
      throw Error("Error al enviar el correo de verificación");
    }

    return {
      message: "Código de verificación enviado a tu correo electrónico",
      email: googleData.email,
      requiresVerification: true,
      tokenAlreadyExists: false,
    };
  }

  // Usuario no existe - crear nuevo usuario
  const verificationToken = generateRandomToken();
  user = await User.create({
    googleId: googleData.googleId,
    name: googleData.name,
    lastname: googleData.lastname ?? "",
    email: googleData.email,
    active: false,
    country_code: "",
    phone: "",
    token: verificationToken,
  });

  try {
    if (!googleData.email) {
      throw new Error("El correo electrónico de Google no está disponible");
    }
    await sendn8nEmailRegistration(
      googleData.email,
      googleData.name,
      verificationToken
    );
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw Error("Error al enviar el correo de verificación");
  }

  return {
    message: "Código de verificación enviado a tu correo electrónico",
    email: googleData.email,
    requiresVerification: true,
    tokenAlreadyExists: false,
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

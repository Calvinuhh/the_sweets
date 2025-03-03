import { compare, hash } from "bcrypt";
import Admin from "../models/Admin";
import { AdminLogin, ChangePassword } from "../interfaces&types/Admin";
import { sign } from "jsonwebtoken";
import { ObjectId } from "mongoose";

process.loadEnvFile();
const { JWT_SECRET } = process.env as { JWT_SECRET: string };

export const login = async (data: AdminLogin) => {
  const { password, username } = data;

  const admin = await Admin.findOne({ username });

  if (!admin) throw Error("Credenciales Incorrectas!");

  if (!(await compare(password, admin.password)))
    throw Error("Contraseña Incorrecta!");

  return sign({ _id: admin._id }, JWT_SECRET, {
    expiresIn: "30m",
  });
};

export const changePassword = async (data: ChangePassword) => {
  const { password, username, new_password } = data;

  const admin = await Admin.findOne({ username });

  if (!admin) throw Error("Error!");

  const decryptPassword = await compare(password, admin.password);

  if (!decryptPassword) throw Error("Contraseña incorrecta");

  admin.password = await hash(new_password, 10);

  await admin.save();
};

export const getAdminById = async (_id: ObjectId) => {
  const admin = await Admin.findById(_id);

  if (!admin) throw Error("Error!");
};

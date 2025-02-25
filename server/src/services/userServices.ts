import { CreateUser } from "../interfaces&types/User";
import User from "../models/User";
import { hash } from "bcrypt";

export const createUser = async (data: CreateUser) => {
  const { name, email, password } = data;

  const userExists = await User.findOne({ email });

  if (userExists) throw Error("Usuario ya registrado");

  const newUser = await User.create({
    name,
    email,
    password: await hash(password, 10),
    token: Math.floor(100000 + Math.random() * 900000).toString(),
  });

  // AGREGAR ENVIO DE EMAIL
};

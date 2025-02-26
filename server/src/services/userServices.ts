import { CreateUser, LoginData } from "../interfaces&types/User";
import User from "../models/User";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

process.loadEnvFile();
const { JWT_SECRET } = process.env as { JWT_SECRET: string };

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

export const login = async (data: LoginData) => {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) throw Error("Usuario no registrado");

  const checkPassword = await compare(password, user.password);

  if (!checkPassword) throw Error("Clave incorrecta");
  return sign(
    { id: user._id, name: user.name, email: user.email },
    JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );
};

export const auth = async (token: string) => {
  const user = await User.findOne({ token });

  if (!user) throw Error("Token invalido");

  if (user.confirmed) throw Error("Usuario ya confirmado");

  user.confirmed = true;
  user.token = "";

  await user.save();

  return "Usuario confirmado, ya puedes loguearte";
};

import { Request, Response } from "express";
import { auth, createUser, login } from "../services/userServices";
import { verify } from "jsonwebtoken";

process.loadEnvFile();
const { JWT_SECRET } = process.env as { JWT_SECRET: string };

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    await createUser({ name, email, password });

    res.status(201).json("Usuario creado");
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const token = await login({ email, password });

    res.status(200).json({ message: "Autenticado", token });
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const authController = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    res.status(200).json(await auth(token));
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

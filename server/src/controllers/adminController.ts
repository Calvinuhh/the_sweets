import { Request, Response } from "express";
import { login } from "../services/adminServices";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    res.status(200).json({
      message: "Login exitoso",
      token: await login({ username, password }),
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

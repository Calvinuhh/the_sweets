import { Request, Response } from "express";
import { createUser } from "../services/userServices";

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
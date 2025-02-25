import { NextFunction, Request, Response } from "express";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/inputValidations";

export const validateNewUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    if (!name) throw Error("El nombre es necesario");
    if (!email) throw Error("El email es necesario");
    if (!password) throw Error("El password es necesario");

    validateName(name, 1, 60);
    validateEmail(email);
    validatePassword(password);

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

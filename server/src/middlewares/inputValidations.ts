import { NextFunction, Request, Response } from "express";

import {
  validateEmail,
  validateLettersAndNumbers,
  validateName,
  validatePassword,
} from "../utils/inputValidations";
import { log } from "console";

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

export const validateNewDesseert = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price } = req.body;

    console.log(req.body);

    if (!name) throw Error("El nombre es necesario");
    if (!price) throw Error("El precio es necesario");

    validateLettersAndNumbers(name);
    if (isNaN(Number(price))) throw Error("El precio debe ser un número");

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

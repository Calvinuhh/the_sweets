import { NextFunction, Request, Response } from "express";
import {
  validateName,
  validatePrice,
  validateDessertTypes,
  validateActive,
} from "../utils/inputValidations";

export const newDessertMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, type } = req.body;

    if (!name) throw Error("El campo 'name' es requerido");
    if (!price) throw Error("El campo 'price' es requerido");
    if (!type) throw Error("El campo 'type' es requerido");

    validateName(name);
    validatePrice(price);
    validateDessertTypes(type);

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const patchDessertMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, type, active } = req.body;

    for (const key in req.body) {
      if (!req.body[key]) throw Error(`El campo '${key}' es requerido`);
    }

    if (name) validateName(name);
    if (price) validatePrice(price);
    if (type) validateDessertTypes(type);
    if (active) validateActive(active);

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const validateNewPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, new_password, password } = req.body;

    if (!username) throw Error("El username es necesario");
    if (!password) throw Error("El password es necesario");
    if (!new_password) throw Error("El nuevo password es necesario");

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

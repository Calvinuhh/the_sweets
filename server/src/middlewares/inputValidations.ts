import { NextFunction, Request, Response } from "express";
import {
  validateName,
  validatePrice,
  validateDessertTypes,
  validateActive,
  validateMaxLength,
  validateFlavor,
} from "../utils/inputValidations";
import { CreateDessert, UpdateDessert } from "../interfaces&types/Dessert";

export const newDessertMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, type, flavor }: CreateDessert = req.body;

    if (!name) throw Error("El campo 'name' es requerido");
    if (!price) throw Error("El campo 'price' es requerido");
    if (!type) throw Error("El campo 'type' es requerido");
    if (!flavor) throw Error("El campo 'flavor' es requerido");

    validateName(name);
    validateMaxLength(name, 100, "name");
    validatePrice(price);
    validateDessertTypes(type);
    validateFlavor(flavor);

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
    const {
      name,
      price,
      type,
      active,
      flavor,
      levels,
      portions,
    }: UpdateDessert = req.body;

    for (const key in req.body) {
      if (key !== "active" && !req.body[key]) {
        throw Error(`El campo '${key}' es requerido`);
      }
    }

    if (name) validateName(name);
    if (price) validatePrice(price);
    if (type) validateDessertTypes(type);
    if (active !== undefined) validateActive(active);
    if (flavor) validateFlavor(flavor);
    if (levels) {
      if (typeof levels !== "number")
        throw Error("El campo 'levels' debe ser un número");
      if (levels < 1) throw Error("El campo 'levels' debe ser mayor a 0");
    }
    if (portions) {
      if (typeof portions !== "number")
        throw Error("El campo 'portions' debe ser un número");
      if (portions < 1) throw Error("El campo 'portions' debe ser mayor a 0");
    }

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

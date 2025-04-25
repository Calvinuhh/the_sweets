import { NextFunction, Request, Response } from "express";
import {
  validateName,
  validatePrice,
  validateDessertTypes,
  validateMaxLength,
  validateFlavorTypes,
  validateAdditionTypes,
} from "../utils/validations";
import { CreateDessert } from "../types/Dessert";

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
    validateFlavorTypes(flavor);

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const newAdditionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, type }: CreateDessert = req.body;

    if (!name) throw Error("El campo 'name' es requerido");
    if (!price) throw Error("El campo 'price' es requerido");
    if (!type) throw Error("El campo 'type' es requerido");

    validateName(name);
    validateMaxLength(name, 100, "name");
    validatePrice(price);
    validateAdditionTypes(type);

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

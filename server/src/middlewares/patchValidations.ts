import { NextFunction, Request, Response } from "express";
import {
  validateName,
  validatePrice,
  validateDessertTypes,
  validateActive,
  validateMaxLength,
  validateFlavorTypes,
  validateAdditionTypes,
} from "../utils/validations";
import { UpdateDessert } from "../interfaces&types/Dessert";

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

    if (name) {
      validateName(name);
      validateMaxLength(name, 100, "name");
    }
    if (price) validatePrice(price);
    if (type) validateDessertTypes(type);
    if (active !== undefined) validateActive(active);
    if (flavor) validateFlavorTypes(flavor);
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

export const patchAdditionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, type } = req.body;

    for (const key in req.body) {
      if (!req.body[key]) {
        throw Error(`El campo '${key}' es requerido`);
      }
    }

    if (name) {
      validateName(name);
      validateMaxLength(name, 100, "name");
    }
    if (price) validatePrice(price);
    if (type) validateAdditionTypes(type);

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

import { Request, Response, NextFunction } from "express";
import { validateLettersAndNumbers } from "../utils/inputValidations";

export const validatePatchDessert = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price } = req.body;

    for (const key in req.body) {
      if (!req.body[key]) throw Error(`El ${key} es necesario`);
    }

    if (name) {
      validateLettersAndNumbers(name);
    }
    if (price) {
      if (isNaN(Number(price))) throw Error("El precio debe ser un número");
    }

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

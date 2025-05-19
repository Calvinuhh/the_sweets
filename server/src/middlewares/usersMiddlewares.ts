import { Request, Response, NextFunction } from "express";
import { UserRegistration } from "../types/User";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validations";

export const validateUserRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      lastname,
      country_code,
      email,
      phone,
      password,
    }: UserRegistration = req.body;

    if (!name) throw Error("El campo 'name' es requerido");
    if (!lastname) throw Error("El campo 'lastname' es requerido");
    if (!country_code) throw Error("El campo 'country_code' es requerido");
    if (!email) throw Error("El campo 'email' es requerido");
    if (!password) throw Error("El campo 'password' es requerido");
    if (!phone) throw Error("El campo 'phone' es requerido");

    validateName(name);
    validateName(lastname);
    if (country_code.length < 2) {
      throw Error("El campo 'country_code' debe tener al menos 2 caracteres");
    }
    if (phone.length < 10) {
      throw Error("El campo 'phone' debe tener al menos 10 caracteres");
    }
    if (phone.length > 15) {
      throw Error("El campo 'phone' no puede tener más de 15 caracteres");
    }
    validatePassword(password);
    validateEmail(email);

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};

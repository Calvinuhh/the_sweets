import { Request, Response, NextFunction } from "express";
import { UserRegistration } from "../types/User";
import {
  validateEmail,
  validateMaxLength,
  validateName,
  validatePassword,
} from "../utils/validations";
import { verify } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

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

    if (country_code.length > 5) {
      throw Error("El campo 'country_code' no puede tener más de 5 caracteres");
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

export const validateTokenConfirmation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, email } = req.body;

    if (!token) throw Error("El campo 'token' es requerido");
    if (!email) throw Error("El campo 'email' es requerido");

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email) throw Error("El campo 'email' es requerido");
    if (!password) throw Error("El campo 'password' es requerido");

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};

export const searchUserByIdWithAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) throw Error("El campo 'authorization' es requerido");

    const token = authorization.split(" ")[1];

    if (!token) throw Error("El token no es válido");

    const decoded = verify(token, process.env.JWT_SECRET as string);

    if (!decoded) throw Error("El token no es válido");

    console.log("decoded", decoded);

    if (typeof decoded === "object" && decoded !== null && "_id" in decoded)
      req.userId = decoded._id as string;

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};

export const patchUserData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, lastname, country_code, phone } = req.body;

    if (name) {
      if (!name) throw Error("El campo 'name' es requerido");
      validateName(name);
      validateMaxLength(name, 100, "name");
    }

    if (lastname) {
      if (!lastname) throw Error("El campo 'lastname' es requerido");
      validateName(lastname);
      validateMaxLength(lastname, 100, "lastname");
    }
    if (country_code) {
      if (!country_code) throw Error("El campo 'country_code' es requerido");
      if (country_code.length < 2)
        throw Error("El campo 'country_code' debe tener al menos 2 caracteres");
      if (country_code.length > 5)
        throw Error(
          "El campo 'country_code' no puede tener más de 5 caracteres"
        );
    }
    if (phone) {
      if (!phone) throw Error("El campo 'phone' es requerido");
      if (phone.length < 10)
        throw Error("El campo 'phone' debe tener al menos 10 caracteres");
      if (phone.length > 15)
        throw Error("El campo 'phone' no puede tener más de 15 caracteres");
    }

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};

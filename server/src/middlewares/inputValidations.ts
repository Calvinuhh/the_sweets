import { NextFunction, Request, Response } from "express";

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

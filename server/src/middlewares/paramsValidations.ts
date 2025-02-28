import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;

    if (!Types.ObjectId.isValid(_id)) throw Error("ID no valido");

    next();
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

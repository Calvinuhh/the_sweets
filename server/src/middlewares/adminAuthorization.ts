import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { getAdminById } from "../services/adminServices";

const { JWT_SECRET } = process.env as { JWT_SECRET: string };

export const adminAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) throw new Error("No se proporciono autorizacion");

    const token = authorization.split(" ")[1];

    const decoded = verify(token, JWT_SECRET);

    if (typeof decoded === "object" && decoded.hasOwnProperty("_id")) {
      await getAdminById(decoded._id);
      next();
    }
  } catch (error) {
    const err = error as Error;
    res.status(400).json({message: err.message});
  }
};

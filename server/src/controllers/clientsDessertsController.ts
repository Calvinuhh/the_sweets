import { Request, Response } from "express";

export const getDessertsController = (req: Request, res: Response) => {
  try {
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

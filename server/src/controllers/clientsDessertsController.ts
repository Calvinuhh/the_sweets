import { Request, Response } from "express";
import { getDesserts } from "../services/clientsDesserts";

export const getDessertsController = async (req: Request, res: Response) => {
  try {
    const { price, type } = req.query as { price: string; type: string };

    res.status(200).json(await getDesserts(price, type));
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

import { Request, Response } from "express";

import {
  createAddition,
  getAdditions,
  getAdditionById,
  updateAddition,
  deleteAddition,
} from "../services/additionsServices";
import { CreateAddition, UpdateAddition } from "../types/Addition";

export const createAdditionController = async (req: Request, res: Response) => {
  try {
    const { name, price, type }: CreateAddition = req.body;

    const newAddition = await createAddition({ name, price, type });

    res.status(201).json(newAddition);
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const getAdditionsController = async (req: Request, res: Response) => {
  try {
    const { type } = req.query as { type: string };

    res.status(200).json(await getAdditions(type));
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const getAdditionByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { _id } = req.params;

    res.status(200).json(await getAdditionById(_id));
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const updateAdditionController = async (req: Request, res: Response) => {
  try {
    const { name, price, type }: UpdateAddition = req.body;
    const { _id } = req.params;

    res.status(200).json(await updateAddition(_id, { name, price, type }));
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const deleteAdditionController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    await deleteAddition(_id);

    res.status(200).json("Adición eliminada correctamente");
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

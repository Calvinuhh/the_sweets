import { Request, Response } from "express";
import {
  createDessert,
  getDesserts,
  updateDessert,
  deleteDessert,
  getDessertById,
} from "../services/dessertServices";

export const createDessertController = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;

    await createDessert({
      name,
      price,
      picture: req.file ? `/images/${req.file.filename}` : null,
    });

    res.status(201).json("Postre creado con éxito");
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const getDessertsController = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await getDesserts());
  } catch (error) {
    const err = error as Error;
    res.status(404).json(err.message);
  }
};

export const getDessertByIdController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    res.status(200).json(await getDessertById(_id));
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const updateDessertsController = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    const { _id } = req.params;

    await updateDessert(_id, {
      name,
      price,
      picture: req.file ? `/images/${req.file.filename}` : req.body.picture,
    });
    res.status(200).json("Postre Actualizado!");
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const deleteDessertsController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    await deleteDessert(_id);
    res.status(204).json("Postre Eliminado");
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

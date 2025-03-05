import { Request, Response } from "express";
import {
  createDessert,
  getDesserts,
  updateDessert,
  deleteDessert,
  getDessertById,
} from "../services/dessertServices";
import {
  validateDessertTypes,
  validateName,
  validatePrice,
} from "../utils/inputValidations";

export const createDessertController = async (req: Request, res: Response) => {
  try {
    const { name, price, type } = req.body;

    if (!name) throw Error("El campo 'name' es requerido");
    if (!price) throw Error("El campo 'price' es requerido");
    if (!type) throw Error("El campo 'type' es requerido");

    validateName(name);
    validatePrice(price);
    validateDessertTypes(type);

    const newDessert = await createDessert({
      name,
      price,
      picture: req.file ? `/images/${req.file.filename}` : null,
      type,
    });

    res.status(201).json(newDessert);
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const getDessertsController = async (req: Request, res: Response) => {
  try {
    const { type } = req.query as { type: string };

    res.status(200).json(await getDesserts(type));
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
    const { name, price, type } = req.body;
    const { _id } = req.params;

    for (const key in req.body) {
      if (!req.body[key]) throw Error(`El campo '${key}' es requerido`);
    }

    if (name) validateName(name);
    if (price) validatePrice(price);
    if (type) validateDessertTypes(type);

    const updatedDessert = await updateDessert(_id, {
      name,
      price,
      picture: req.file ? `/images/${req.file.filename}` : req.body.picture,
      type,
    });
    res.status(200).json(updatedDessert);
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

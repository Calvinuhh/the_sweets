import { Request, Response } from "express";
import {
  createDessert,
  getDesserts,
  updateDessert,
  deleteDessert,
  getDessertById,
  addPicture,
  deleteImageDessert,
} from "../services/dessertServices";
import { CreateDessert, UpdateDessert } from "../interfaces&types/Dessert";

export const createDessertController = async (req: Request, res: Response) => {
  try {
    const { name, price, type, flavor }: CreateDessert = req.body;

    const newDessert = await createDessert({
      name,
      price,
      type,
      flavor,
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
    res.status(404).json(err.message);
  }
};

export const updateDessertsController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      type,
      active,
      flavor,
      levels,
      portions,
    }: UpdateDessert = req.body;
    const { _id } = req.params;

    const updatedDessert = await updateDessert(_id, {
      name,
      price,
      type,
      active,
      flavor,
      levels,
      portions,
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

export const addPictureDessertController = async (
  req: Request,
  res: Response
) => {
  try {
    const { _id } = req.params;

    if (!req.file) throw Error("No se ha subido ninguna imagen");

    const updatedDessert = await addPicture(
      _id,
      `/images/${req.file.filename}`
    );

    res.status(200).json(updatedDessert);
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const deleteImageDessertController = async (
  req: Request,
  res: Response
) => {
  try {
    const { _id } = req.params;

    res.status(200).json(await deleteImageDessert(_id));
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

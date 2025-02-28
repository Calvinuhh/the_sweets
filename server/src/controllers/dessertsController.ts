import { Request, Response } from "express";
import {
  createDessert,
  getDesserts,
  updateDessert,
  deleteDessert,
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

//REVISAR
export const updateDessertsController = async (req: Request, res: Response) => {
  try {
    const picturePath = req.file
      ? `/images/${req.file.filename}`
      : req.body.picture;
    const dessertData = { ...req.body, picture: picturePath };
    const dessert = await updateDessert(req.params.id, dessertData);
    res.status(200).json(dessert);
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

//REVISAR
export const deleteDessertsController = async (req: Request, res: Response) => {
  try {
    await deleteDessert(req.params.id);
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

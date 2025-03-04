import { CreateDessert, UpdateDessert } from "../interfaces&types/Dessert";
import Dessert from "../models/Dessert";
import path from "path";
import fs from "fs";

export const createDessert = async (data: CreateDessert) => {
  const { name, picture, price, type } = data;

  const dessertName = await Dessert.findOne({ name });

  if (dessertName) throw Error("Ya existe un postre llamado asi");

  return await Dessert.create({ name, picture, price, type });
};

export const getDesserts = async (type?: string) => {
  if (!type) {
    const desserts = await Dessert.find();
    if (desserts.length === 0) throw Error("No hay postres disponibles");
    return desserts;
  }

  const desserts = await Dessert.find({ type });

  if (desserts.length === 0)
    throw Error(`No se encontraron postres de tipo ${type}`);

  return desserts;
};

export const getDessertById = async (_id: string) => {
  const dessert = await Dessert.findById(_id);

  if (!dessert) throw Error("Postre no encontrado");

  return dessert;
};

export const updateDessert = async (_id: string, data: UpdateDessert) => {
  const { name, picture, price } = data;

  const dessert = await Dessert.findById(_id);
  if (!dessert) throw Error("Postre no encontrado");

  if (picture && dessert.picture) {
    const oldFilePath = path.join(
      __dirname,
      "../images",
      path.basename(dessert.picture)
    );

    fs.unlink(oldFilePath, (err) => {
      if (err && err.code !== "ENOENT") {
        throw Error(err.message);
      }
    });
  }

  const updateObject: UpdateDessert = {};
  if (name) updateObject.name = name;
  if (price) updateObject.price = price;
  if (picture) updateObject.picture = picture;

  return await Dessert.findByIdAndUpdate(_id, updateObject, { new: true });
};

export const deleteDessert = async (_id: string) => {
  const dessert = await Dessert.findById(_id);

  if (!dessert) throw new Error("Postre no encontrado");

  if (dessert.picture && typeof dessert.picture === "string") {
    const filePath = path.join(__dirname, "..", dessert.picture);

    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") {
        throw Error("Error al eliminar el archivo:", err);
      }
    });
  }

  await Dessert.findByIdAndDelete(_id);
};

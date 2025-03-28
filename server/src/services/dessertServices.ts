import { CreateDessert, UpdateDessert } from "../interfaces&types/Dessert";
import Dessert from "../models/Dessert";
import path from "path";
import fs from "fs";

export const createDessert = async (data: CreateDessert) => {
  const { name, price, type, flavor } = data;

  const dessertName = await Dessert.findOne({ name });

  if (dessertName) throw Error("Ya existe un postre con ese nombre");

  return await Dessert.create({ name, price, type, flavor });
};

export const getDesserts = async (type?: string) => {
  if (!type) {
    const desserts = await Dessert.find();
    if (desserts.length === 0) return "No hay postres disponibles";
    return desserts;
  }

  const desserts = await Dessert.find({ type });

  if (desserts.length === 0) return `No se encontraron postres de tipo ${type}`;

  return desserts;
};

export const getDessertById = async (_id: string) => {
  const dessert = await Dessert.findById(_id);

  if (!dessert) throw Error("Postre no encontrado");

  return dessert;
};

export const updateDessert = async (_id: string, data: UpdateDessert) => {
  const { name, price, type, active, flavor, levels, portions } = data;

  const dessert = await Dessert.findById(_id);
  if (!dessert) throw Error("Postre no encontrado");

  if (name) {
    const dessertName = await Dessert.findOne({ name });
    if (dessertName) {
      throw new Error("Ya existe un postre con ese nombre");
    }
  }

  const updateObject: UpdateDessert = {};
  if (name) updateObject.name = name;
  if (price) updateObject.price = price;
  if (type) updateObject.type = type;
  if (active !== undefined) updateObject.active = active;
  if (levels) updateObject.levels = levels;
  if (portions) updateObject.portions = portions;
  if (flavor) updateObject.flavor = flavor;

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

//IMAGES
export const addPicture = async (_id: string, picturePath: string) => {
  const dessert = await Dessert.findById(_id);

  if (!dessert) {
    throw new Error("Postre no encontrado");
  }

  if (dessert.picture) {
    throw new Error("El postre ya tiene una imagen asociada");
  }

  dessert.picture = picturePath;
  await dessert.save();

  return dessert;
};

export const deleteImageDessert = async (_id: string) => {
  const dessert = await Dessert.findById(_id);

  if (!dessert) throw Error("Postre no encontrado");

  if (!dessert.picture) throw Error("El postre no tiene una imagen");

  if (dessert.picture && typeof dessert.picture === "string") {
    const filePath = path.join(__dirname, "..", dessert.picture);

    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") {
        throw Error("Error al eliminar el archivo: " + err.message);
      }
    });
  }

  return await Dessert.findByIdAndUpdate(_id, { picture: null }, { new: true });
};

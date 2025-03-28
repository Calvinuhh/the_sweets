import Addition from "../models/Addition";
import { CreateAddition, UpdateAddition } from "../interfaces&types/Addition";

export const createAddition = async (data: CreateAddition) => {
  const { name, price, type } = data;

  const additionName = await Addition.findOne({ name });

  if (additionName) throw Error("Ya existe una adición con ese nombre");

  return await Addition.create({ name, price, type });
};

export const getAdditions = async (type?: string) => {
  if (!type) {
    const additions = await Addition.find();
    if (additions.length === 0) return "No hay adiciones disponibles";
    return additions;
  }

  const additions = await Addition.find({ type });

  if (additions.length === 0)
    return `No se encontraron adiciones de tipo ${type}`;

  return additions;
};

export const getAdditionById = async (_id: string) => {
  const addition = await Addition.findById(_id);

  if (!addition) throw Error("Adición no encontrada");

  return addition;
};

export const updateAddition = async (_id: string, data: UpdateAddition) => {
  const { name, price, type } = data;

  const addition = await Addition.findById(_id);
  if (!addition) throw Error("Adición no encontrada");

  if (name) {
    const additionName = await Addition.findOne({ name });
    if (additionName) {
      throw new Error("Ya existe una adición con ese nombre");
    }
  }

  const updateObject: UpdateAddition = {};

  if (name) updateObject.name = name;
  if (price) updateObject.price = price;
  if (type) updateObject.type = type;

  return await Addition.findByIdAndUpdate(_id, updateObject, {
    new: true,
  });
};

export const deleteAddition = async (_id: string) => {
  const addition = await Addition.findById(_id);

  if (!addition) throw Error("Adición no encontrada");

  await Addition.findByIdAndDelete(_id);
};

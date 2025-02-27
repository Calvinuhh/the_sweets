import { CreateDessert } from "../interfaces&types/Dessert";
import Dessert from "../models/Dessert";

export const createDessert = async (data: CreateDessert) => {
  const { name, picture, price } = data;

  const dessertName = await Dessert.findOne({ name });

  if (dessertName) throw Error("Ya existe un archivo llamado asi");

  await Dessert.create({ name, picture, price });
};

export const getDesserts = async () => {
  const desserts = await Dessert.find();

  if (desserts.length === 0) throw Error("No hay postres en la base de datos");
  return desserts;
};

//REVISAR
export const updateDessert = async (id: string, data: any) => {
  return await Dessert.findByIdAndUpdate(id, data, { new: true });
};

//REVISAR
export const deleteDessert = async (id: string) => {
  return await Dessert.findByIdAndDelete(id);
};

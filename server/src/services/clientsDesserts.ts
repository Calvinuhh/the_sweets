import Dessert from "../models/Dessert";

export const getDesserts = async () => {
  const desserts = await Dessert.find();

  if (desserts.length === 0) throw Error("No hay postres disponibles");

  return desserts;
};

import Dessert from "../models/Dessert";

interface QueryType {
  active: boolean;
  type?: string;
  price?: string;
}

export const getDesserts = async (price?: string, type?: string) => {
  const queryObject: QueryType = { active: true };

  if (type) queryObject.type = type;

  let desserts = await Dessert.find(queryObject);

  if (price) {
    if (price.toUpperCase() === "ASC") {
      desserts.sort((a, b) => a.price - b.price);
    } else if (price.toUpperCase() === "DESC") {
      desserts.sort((a, b) => b.price - a.price);
    } else {
      throw Error("El valor de 'price' debe ser 'ASC' o 'DESC'");
    }
  }

  if (desserts.length === 0) return "No hay postres disponibles";

  return desserts;
};

export const getDessertById = async (_id: string) => {
  const dessert = await Dessert.findById(_id).populate({
    path: "additions",
    select: "name price",
  });

  if (!dessert) throw Error("Postre no encontrado");

  return dessert;
};

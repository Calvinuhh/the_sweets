import { ObjectId } from "mongoose";

type DessertType = "torta" | "rollo" | "galleta" | "postre_frio";

export default interface Dessert {
  _id: ObjectId;
  name: string;
  price: number;
  picture: string | null;
  type: DessertType;
  active: boolean;
}

export type CreateDessert = Pick<Dessert, "name" | "price" | "type">;
export type UpdateDessert = Partial<Omit<Dessert, "_id" | "picture">>;

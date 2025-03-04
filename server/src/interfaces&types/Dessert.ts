import { ObjectId } from "mongoose";

export type DessertType = "torta" | "rollo" | "galleta" | "postre_frio";

export default interface Dessert {
  _id: ObjectId;
  name: string;
  price: number;
  picture: string | null;
  type: DessertType;
}

export type CreateDessert = Omit<Dessert, "_id">;
export type UpdateDessert = Partial<CreateDessert>;

import { ObjectId } from "mongoose";

type DessertType = "torta" | "rollo" | "galleta" | "postre_frio";
type FlavorType = "chocolate" | "vainilla" | "caramelo";

export default interface Dessert {
  _id: ObjectId;
  name: string;
  price: number;
  picture: string | null;
  portions: number;
  levels: number;
  flavor: FlavorType;
  type: DessertType;
  active: boolean;
  additions: Array<ObjectId>;
}

export type CreateDessert = Pick<Dessert, "name" | "price" | "type" | "flavor">;
export type UpdateDessert = Partial<
  Omit<Dessert, "_id" | "picture" | "additions">
>;

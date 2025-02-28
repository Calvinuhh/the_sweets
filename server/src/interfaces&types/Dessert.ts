import { ObjectId } from "mongoose";

export default interface Dessert {
  _id: ObjectId;
  name: string;
  price: number;
  picture: string | null;
}

export type CreateDessert = Pick<Dessert, "name" | "price" | "picture">;
export type UpdateDessert = Partial<CreateDessert>;

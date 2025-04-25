import { ObjectId } from "mongoose";

type AdditionType = "cobertura" | "relleno" | "decoracion" | "topping";

export default interface Addition {
  _id: ObjectId;
  name: string;
  price: number;
  type: AdditionType;
}

export type CreateAddition = Pick<Addition, "name" | "price" | "type">;
export type UpdateAddition = Partial<CreateAddition>;

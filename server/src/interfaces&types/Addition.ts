import { ObjectId } from "mongoose";

type AdditionType = "cobertura" | "relleno" | "decoracion" | "topping";

export default interface Addition {
  _id: ObjectId;
  name: string;
  price: number;
  type: AdditionType;
  active: boolean;
}

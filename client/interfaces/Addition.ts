export type AdditionType = "cobertura" | "relleno" | "decoracion" | "topping";

export default interface Addition {
  _id: string;
  name: string;
  price: number;
  type: AdditionType;
}

export type CreateAddition = Pick<Addition, "name" | "price" | "type">;
export type UpdateAddition = Partial<CreateAddition>;

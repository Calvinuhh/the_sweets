export interface Dessert {
  _id: string;
  name: string;
  price: number;
  picture?: string;
  portions: number;
  levels: number;
  flavor: "chocolate" | "vainilla" | "caramelo";
  type: "torta" | "postre_frio" | "rollo" | "galleta";
  active: boolean;
  additions?: Array<{
    _id: string;
    name: string;
    price: number;
  }>;
}

export type CreateDessert = Pick<Dessert, "name" | "price" | "type" | "flavor">;
export type UpdateDessert = Partial<
  Omit<Dessert, "_id" | "picture" | "additions">
>;

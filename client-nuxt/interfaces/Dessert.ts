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
  additions?: string[];
}


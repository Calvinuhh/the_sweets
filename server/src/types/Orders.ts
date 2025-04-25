import { ObjectId } from "mongoose";

interface Dessert {
  dessert: ObjectId;
  amount: number;
}

export default interface Order {
  _id: ObjectId;
  desserts: Array<Dessert>;
  user: ObjectId;
  total: number;
  date: Date;
}

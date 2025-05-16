import { ObjectId } from "mongoose";

type UserData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export interface Request {
  _id: ObjectId;
  userData: UserData;
  dessert: string;
  date: Date;
  total: number;
}

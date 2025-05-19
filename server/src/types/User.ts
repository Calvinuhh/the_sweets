import { ObjectId } from "mongoose";

export interface User {
  _id: ObjectId;
  name: string;
  lastname: string;
  email: string;
  password: string;
  country_code: string;
  phone: string;
}

export type UserRegistration = Omit<User, "_id">;
export type UserLogin = Pick<User, "email" | "password">;

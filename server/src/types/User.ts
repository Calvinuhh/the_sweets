import { ObjectId } from "mongoose";

export interface User {
  _id: ObjectId;
  name: string;
  lastname: string;
  email: string;
  password: string;
  country_code: string;
  phone: string;
  token?: string | null;
  active: boolean;
}

export type UserRegistration = Omit<User, "_id" | "active" | "token">;
export type UserLogin = Pick<User, "email" | "password">;
export type UserUpdate = Partial<
  Omit<User, "_id" | "active" | "token" | "password" | "email">
>;

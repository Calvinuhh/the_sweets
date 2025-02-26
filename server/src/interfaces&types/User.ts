import { ObjectId } from "mongoose";

export default interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  token: string;
  confirmed: boolean;
}

export type CreateUser = Pick<User, "name" | "email" | "password">;

export type LoginData = Pick<User, "email" | "password">;

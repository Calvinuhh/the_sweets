import { ObjectId } from "mongoose";

export default interface Admin {
  _id: ObjectId;
  username: string;
  password: string;
}

export type AdminLogin = Pick<Admin, "username" | "password">;

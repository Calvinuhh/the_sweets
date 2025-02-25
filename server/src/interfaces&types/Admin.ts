import { ObjectId } from "mongoose";

export default interface Admin {
  _id: ObjectId;
  username: string;
  password: string;
}

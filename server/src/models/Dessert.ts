import { Schema, model } from "mongoose";
import Dessert from "../interfaces&types/Dessert";

const dessertSchema = new Schema<Dessert>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    picture: {
      type: String,
    },
  },
  { versionKey: false }
);

export default model<Dessert>("dessert", dessertSchema);

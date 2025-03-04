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
    type: {
      type: String,
      required: true,
      enum: ["torta", "postre_frio", "rollo", "galleta"],
    },
  },
  { versionKey: false }
);

export default model<Dessert>("dessert", dessertSchema);

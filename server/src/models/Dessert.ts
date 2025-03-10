import { Schema, model } from "mongoose";
import Dessert from "../interfaces&types/Dessert";

const dessertSchema = new Schema<Dessert>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/,
    },
    price: {
      type: Number,
      required: true,
      min: 1000,
    },
    picture: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["torta", "postre_frio", "rollo", "galleta"],
    },
    active: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { versionKey: false }
);

export default model<Dessert>("dessert", dessertSchema);

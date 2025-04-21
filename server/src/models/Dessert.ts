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
      maxlength: 100,
      lowercase: true,
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
    portions: {
      type: Number,
      default: 1,
    },
    levels: {
      type: Number,
      default: 1,
    },
    flavor: {
      type: String,
      trim: true,
      required: true,
      enum: ["chocolate", "vainilla", "caramelo"],
    },
    type: {
      type: String,
      trim: true,
      required: true,
      enum: ["torta", "postre_frio", "rollo", "galleta"],
    },
    active: {
      type: Boolean,
      default: false,
      required: true,
    },
    additions: [
      {
        type: Schema.Types.ObjectId,
        ref: "addition",
      },
    ],
  },
  { versionKey: false, timestamps: false }
);

export default model<Dessert>("dessert", dessertSchema);

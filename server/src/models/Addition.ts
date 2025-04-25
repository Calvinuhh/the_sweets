import { model, Schema } from "mongoose";
import Addition from "../interfaces&types/Addition";

const additionSchema = new Schema<Addition>(
  {
    name: {
      type: String,
      trim: true,
      match: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/,
      unique: true,
      required: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1000,
    },
    type: {
      type: String,
      required: true,
      enum: ["cobertura", "relleno", "topping", "decoracion"],
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export default model<Addition>("addition", additionSchema);

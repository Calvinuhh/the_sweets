import { model, Schema } from "mongoose";
import { Types } from "mongoose";

const dessertSchema = new Schema(
  {
    dessert: {
      type: Types.ObjectId,
      ref: "dessert",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const orderSchema = new Schema(
  {
    desserts: [dessertSchema],
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { versionKey: false }
);

export default model("order", orderSchema);

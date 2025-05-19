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
    timestamps: false,
  }
);

//TODO
// const orderSchema = new Schema({

// }, { versionKey: false });

// export default model("order", orderSchema);

import { model, Schema } from "mongoose";
import AdminModel from "../types/Admin";

const adminSchema = new Schema<AdminModel>(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

adminSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await model<AdminModel>("admin").countDocuments();
    if (count > 0) {
      throw new Error("Solo puede existir un administrador");
    }
  }
  next();
});

export default model<AdminModel>("admin", adminSchema);

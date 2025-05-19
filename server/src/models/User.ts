import { model, Schema } from "mongoose";
import { User } from "../types/User";

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      match: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/,
      maxlength: 100,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      match: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      isEmail: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      match:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    },
    country_code: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: false, versionKey: false }
);

const capitalize = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

userSchema.pre("save", function (next) {
  if (this.name) {
    this.name = capitalize(this.name);
  }

  if (this.lastname) {
    this.lastname = capitalize(this.lastname);
  }

  next();
});

export default model<User>("User", userSchema);

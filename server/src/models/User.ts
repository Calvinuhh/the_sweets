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
      required: function (this: User) {
        return !this.googleId;
      },
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    country_code: {
      type: String,
      required: function (this: User) {
        return !this.googleId;
      },
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
      default: null,
      trim: true,
    },
    active: {
      type: Boolean,
      default: false,
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

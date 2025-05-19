import { UserLogin, UserRegistration } from "../types/User";
import User from "../models/User";
import { hash } from "bcrypt";

export const register = async (userData: UserRegistration) => {
  const { name, lastname, email, password, country_code, phone } = userData;

  const user = await User.findOne({ email });

  if (user) {
    throw new Error("User already exists");
  }

  return await User.create({
    name,
    lastname,
    email,
    password,
  });
};

export const login = async (userData: UserLogin) => {};

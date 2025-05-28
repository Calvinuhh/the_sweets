export interface User {
  _id?: string;
  name: string;
  lastname: string;
  email: string;
  password?: string;
  googleId?: string;
  country_code?: string;
  phone?: string;
  token?: string | null;
  active?: boolean;
}

export type UserRegistration = Omit<User, "_id" | "active" | "token">;
export type UserLogin = Pick<User, "email" | "password">;
export type UserUpdate = Partial<
  Omit<User, "_id" | "active" | "token" | "password" | "email">
>;

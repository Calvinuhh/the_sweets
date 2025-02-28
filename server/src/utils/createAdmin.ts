import Admin from "../models/Admin";
import { hash } from "bcrypt";

process.loadEnvFile();
const { ADMIN, PASSWORD } = process.env as { [key: string]: string };

const createAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne();

    if (!existingAdmin)
      await Admin.create({
        username: ADMIN,
        password: await hash(PASSWORD, 10),
      });
  } catch (error) {
    const err = error as Error;
    throw Error(err.message);
  }
};

export default createAdmin;
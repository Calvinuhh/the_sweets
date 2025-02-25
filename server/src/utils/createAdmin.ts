import Admin from "../models/Admin";

process.loadEnvFile();
const { ADMIN, PASSWORD } = process.env;

const createAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne();

    if (!existingAdmin)
      await Admin.create({ username: ADMIN, password: PASSWORD });
  } catch (error) {
    const err = error as Error;
    throw Error(err.message);
  }
};

export default createAdmin;

import { connect } from "mongoose";

const { DB_URI } = process.env as { DB_URI: string };

const DBConnection = async () => {
  try {
    await connect(DB_URI);
    console.log("conexion exitosa con la base de datos");
  } catch (error) {
    const err = error as Error;
    console.log("Error al conectar la base de datos");
    throw Error(err.message);
  }
};

export default DBConnection;

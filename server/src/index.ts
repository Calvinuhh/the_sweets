import app from "./app";
import DBConnection from "./database/database";
import createAdmin from "./utils/createAdmin";

process.loadEnvFile();
const { PORT } = process.env;

DBConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Servidor escuchando en el puerto: ${PORT}, node version: ${process.version}`
      );
    });

    createAdmin();
  })
  .catch((error) => {
    console.log(error);
  });

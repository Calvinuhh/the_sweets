import app from "./app";
import DBConnection from "./database/database";
import createAdmin from "./utils/createAdmin";
import createImagesFolder from "./utils/createImagesFolder";

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
    createImagesFolder();
  })
  .catch((error) => {
    console.log(error);
  });

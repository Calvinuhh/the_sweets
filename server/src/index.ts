import app from "./app";
import DBConnection from "./config/database";
import createAdmin from "./utils/createAdmin";
import createImagesFolder from "./utils/createImagesFolder";

const { PORT } = process.env;

DBConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto: ${PORT}`);
    });

    createAdmin();
    createImagesFolder();
  })
  .catch((error) => {
    console.log(error);
  });

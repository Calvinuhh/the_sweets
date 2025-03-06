import multer from "multer";
import path from "path";
import Dessert from "../models/Dessert";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: async (req, file, cb) => {
    try {
      const { name, price, type, active } = req.body;

      for (const key in req.body) {
        if (!req.body[key]) throw Error(`El campo '${key}' es requerido`);
      }

      if (name) {
        if (!/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(name))
          return cb(
            new Error("El campo 'name' solo puede tener letras y numeros"),
            ""
          );

        const dessertName = await Dessert.findOne({ name });
        if (dessertName) {
          return cb(new Error("Ya existe un postre con ese nombre"), "");
        }
      }

      if (price) {
        if (isNaN(price))
          return cb(new Error("El campo 'price' debe ser un numero"), "");
        if (price <= 999)
          return cb(
            new Error("El precio debe ser un número mayor o igual a 1000."),
            ""
          );
      }

      if (active) {
        if (active !== "true" && active !== "false")
          return cb(new Error("el campo 'active' debe ser true o false"), "");
      }

      if (type) {
        if (
          type != "postre_frio" &&
          type != "galleta" &&
          type != "rollo" &&
          type != "torta"
        )
          return cb(
            new Error(
              "Los tipos de postre permitidos son: 'postre_frio', 'galleta', 'rollo' y 'torta'"
            ),
            ""
          );
      }

      const ext = path.extname(file.originalname);
      const now = new Date();
      const timestamp = `${now.getDate()}${
        now.getMonth() + 1
      }${now.getFullYear()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
      const fileName = `${timestamp}${ext}`;

      cb(null, fileName);
    } catch (error) {
      cb(error as Error, "");
    }
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de tipo .jpg, .png o .webp"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;

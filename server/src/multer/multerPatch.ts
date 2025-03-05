import multer from "multer";
import path from "path";
import Dessert from "../models/Dessert";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: async (req, file, cb) => {
    const { name, price, type } = req.body;
    const { _id } = req.params;

    if (name) {
      if (!/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(name))
        return cb(
          new Error("El campo 'name' solo puede tener letras y numeros"),
          ""
        );

      const existingDessert = await Dessert.findOne({ name });
      if (existingDessert && existingDessert._id.toString() !== _id) {
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
    const originalNameWithoutExt = path.basename(file.originalname, ext);

    const sanitizedFileName = name
      ? name.replace(/\s+/g, "_").toLowerCase()
      : originalNameWithoutExt.toLowerCase();

    const fileName = `${sanitizedFileName}${ext}`;
    cb(null, fileName);
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

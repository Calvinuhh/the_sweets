import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    const { name, price, type } = req.body;

    console.log(req.body);

    if (!name) {
      return cb(new Error("El campo 'name' es requerido"), "");
    }

    if (!price) {
      return cb(new Error("El campo 'price' es requerido"), "");
    }

    if (price <= 999) {
      return cb(
        new Error("El precio debe ser un número mayor o igual a 1000."),
        ""
      );
    }
    if (
      type != "postre_frio" &&
      type != "galleta" &&
      type != "rollo" &&
      type != "torta"
    ) {
      return cb(
        new Error(
          "Los tipos de postre permitidos son: 'postre_frio', 'galleta', 'rollo' y 'torta'"
        ),
        ""
      );
    }

    const ext = path.extname(file.originalname);
    const sanitizedFileName = name.replace(/\s+/g, "_").toLowerCase();
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

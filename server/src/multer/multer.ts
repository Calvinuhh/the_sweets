import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    const { name, price, type } = req.body;
    if (!name) {
      return cb(new Error("El campo 'name' es necesario"), "");
    }
    if (!price) {
      return cb(new Error("El campo 'price' es necesario"), "");
    }
    if (!type) {
      return cb(new Error("El campo 'type' es necesario"), "");
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

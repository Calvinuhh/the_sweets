import multer from "multer";
import path from "path";
import Dessert from "../models/Dessert";
import { Request, Response, NextFunction } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: async (req, file, cb) => {
    const { _id } = req.params;

    try {
      const dessert = await Dessert.findById(_id);

      if (!dessert) {
        return cb(new Error("Postre no encontrado"), "");
      }

      if (dessert.picture) {
        return cb(new Error("El postre ya tiene una imagen asociada"), "");
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

export const multerError = (
  err: Error | multer.MulterError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json(err.message);
  } else if (err) {
    res.status(400).json(err.message);
  } else {
    next();
  }
};

export default upload;

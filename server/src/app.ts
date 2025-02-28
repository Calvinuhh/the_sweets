import express, { json } from "express";
import router from "./router/router";
import cors from "cors";
import multer from "multer";
import path from "path";

const { CLIENT_URL } = process.env as {
  CLIENT_URL: string;
};

const app = express();

app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.use(json());
app.use(router);
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: err.message });
    } else if (err) {
      res.status(500).json({ error: err.message });
    } else {
      next();
    }
  }
);

app.use("/images", express.static(path.join(__dirname, "/images")));

export default app;

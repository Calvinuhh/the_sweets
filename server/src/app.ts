import express, { json } from "express";
import router from "./router/router";
import cors from "cors";
import path from "path";
import morgan from "morgan"
import { multerError } from "./multer/multer";

process.loadEnvFile()
const { CLIENT_URL } = process.env as {
  CLIENT_URL: string;
};

const app = express();

app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.use(morgan("dev"))
app.use(json());
app.use(router);
app.use(multerError);
app.use("/images", express.static(path.join(__dirname, "/images")));

export default app;

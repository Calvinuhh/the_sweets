import express, { json } from "express";
import router from "./router/router";

const app = express();

app.use(json());

app.use(router);

export default app;

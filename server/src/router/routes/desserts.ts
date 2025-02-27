import { Router } from "express";
import {
  createDessertController,
  deleteDessertsController,
  getDessertsController,
  updateDessertsController,
} from "../../controllers/dessertsController";
import upload from "../../multer/multer";
import { validateNewDesseert } from "../../middlewares/inputValidations";

const dessertsRouter: Router = Router();

dessertsRouter.post(
  "/",
  validateNewDesseert,
  upload.single("picture"),
  createDessertController
);
dessertsRouter.get("/", getDessertsController);
dessertsRouter.patch(
  "/:id",
  upload.single("picture"),
  updateDessertsController
);
dessertsRouter.delete("/id", deleteDessertsController);

export default dessertsRouter;

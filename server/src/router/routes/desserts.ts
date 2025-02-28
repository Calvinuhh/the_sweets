import { Router } from "express";
import {
  createDessertController,
  deleteDessertsController,
  getDessertsController,
  updateDessertsController,
} from "../../controllers/dessertsController";
import upload from "../../multer/multer";
import { validateNewDesseert } from "../../middlewares/inputValidations";
import { adminAuthorization } from "../../middlewares/adminAuthorization";

const dessertsRouter: Router = Router();

dessertsRouter.use(adminAuthorization);

dessertsRouter.post(
  "/",
  upload.single("picture"),
  validateNewDesseert,
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

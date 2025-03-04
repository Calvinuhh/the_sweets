import { Router } from "express";
import {
  createDessertController,
  deleteDessertsController,
  getDessertByIdController,
  getDessertsController,
  updateDessertsController,
} from "../../controllers/dessertsController";
import upload from "../../multer/multer";
import { adminAuthorization } from "../../middlewares/adminAuthorization";
import { validateObjectId } from "../../middlewares/paramsValidations";

const dessertsRouter: Router = Router();

// dessertsRouter.use(adminAuthorization);

dessertsRouter.param("_id", validateObjectId);

dessertsRouter.post("/", upload.single("picture"), createDessertController);
dessertsRouter.get("/", getDessertsController);
dessertsRouter.get("/:_id", getDessertByIdController);
dessertsRouter.patch(
  "/:_id",
  upload.single("picture"),
  updateDessertsController
);
dessertsRouter.delete("/:_id", deleteDessertsController);

export default dessertsRouter;

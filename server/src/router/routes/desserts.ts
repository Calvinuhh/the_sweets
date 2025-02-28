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
import { validatePatchDessert } from "../../middlewares/patchValidations";

const dessertsRouter: Router = Router();

dessertsRouter.use(adminAuthorization);

dessertsRouter.post("/", upload.single("picture"), createDessertController);
dessertsRouter.get("/", getDessertsController);
dessertsRouter.get("/:_id", validateObjectId, getDessertByIdController);
dessertsRouter.patch(
  "/:_id",
  validateObjectId,
  validatePatchDessert,
  upload.single("picture"),
  updateDessertsController
);
dessertsRouter.delete("/:_id", validateObjectId, deleteDessertsController);

export default dessertsRouter;

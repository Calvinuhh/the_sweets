import { Router } from "express";
import {
  createDessertController,
  deleteDessertsController,
  getDessertByIdController,
  getDessertsController,
  updateDessertsController,
  deleteImageDessertController,
} from "../../controllers/dessertsController";
import upload from "../../multer/multer";
import updoadPatch from "../../multer/multerPatch";
import { adminAuthorization } from "../../middlewares/adminAuthorization";
import { validateObjectId } from "../../middlewares/paramsValidations";
import {
  newDessertMiddleware,
  patchDessertMiddleware,
} from "../../middlewares/inputValidations";

const dessertsRouter: Router = Router();

dessertsRouter.use(adminAuthorization);

dessertsRouter.param("_id", validateObjectId);

dessertsRouter.post(
  "/",
  upload.single("picture"),
  newDessertMiddleware,
  createDessertController
);

dessertsRouter.get("/", getDessertsController);
dessertsRouter.get("/:_id", getDessertByIdController);
dessertsRouter.patch(
  "/:_id",
  updoadPatch.single("picture"),
  patchDessertMiddleware,
  updateDessertsController
);
dessertsRouter.delete("/:_id", deleteDessertsController);
dessertsRouter.delete("/picture/:_id", deleteImageDessertController);

export default dessertsRouter;

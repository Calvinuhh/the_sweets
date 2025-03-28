import { Router } from "express";
import {
  createDessertController,
  getDessertsController,
  getDessertByIdController,
  deleteDessertsController,
  updateDessertsController,
  deleteImageDessertController,
  addPictureDessertController,
} from "../../controllers/dessertsController";
import upload from "../../multer/multer";
import { adminAuthorization } from "../../middlewares/adminAuthorization";
import { validateObjectId } from "../../middlewares/paramsValidations";
import {
  newDessertMiddleware,
  patchDessertMiddleware,
} from "../../middlewares/inputValidations";

const dessertsRouter: Router = Router();

// dessertsRouter.use(adminAuthorization);
dessertsRouter.param("_id", validateObjectId);

dessertsRouter.post("/", newDessertMiddleware, createDessertController);
dessertsRouter.get("/", getDessertsController);
dessertsRouter.get("/:_id", getDessertByIdController);
dessertsRouter.patch("/:_id", patchDessertMiddleware, updateDessertsController);
dessertsRouter.delete("/:_id", deleteDessertsController);

//Pictures
dessertsRouter.patch(
  "/picture/:_id",
  upload.single("picture"),
  addPictureDessertController
);
dessertsRouter.delete("/picture/:_id", deleteImageDessertController);

//Additions


export default dessertsRouter;

import { Router } from "express";
import {
  createAdditionController,
  getAdditionsController,
  getAdditionByIdController,
  updateAdditionController,
  deleteAdditionController,
} from "../../controllers/additionsController";
import { validateObjectId } from "../../middlewares/paramsValidations";
import { newAdditionMiddleware } from "../../middlewares/inputValidations";
import { patchAdditionMiddleware } from "../../middlewares/patchValidations";
import { adminAuthorization } from "../../middlewares/adminAuthorization";

const additionsRouter: Router = Router();

additionsRouter.use(adminAuthorization);
additionsRouter.param("_id", validateObjectId);

additionsRouter.post("/", newAdditionMiddleware, createAdditionController);
additionsRouter.get("/", getAdditionsController);
additionsRouter.get("/:_id", getAdditionByIdController);
additionsRouter.patch(
  "/:_id",
  patchAdditionMiddleware,
  updateAdditionController
);
additionsRouter.delete("/:_id", deleteAdditionController);

export default additionsRouter;

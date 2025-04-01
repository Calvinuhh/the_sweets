import { Router } from "express";
import {
  getDessertsController,
  getDessertByIdController,
} from "../../controllers/clientsDessertsController";
import { validateObjectId } from "../../middlewares/paramsValidations";

const clientDesserts: Router = Router();

clientDesserts.param("_id", validateObjectId);

clientDesserts.get("/", getDessertsController);
clientDesserts.get("/:_id", getDessertByIdController);

export default clientDesserts;

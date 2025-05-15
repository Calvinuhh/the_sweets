import { Router } from "express";
import {
  getDessertsController,
  getDessertByIdController,
} from "../../controllers/clientsDessertsController";
import { validateObjectId } from "../../middlewares/paramsValidations";

const client: Router = Router();

client.param("_id", validateObjectId);

client.get("/", getDessertsController);
client.get("/:_id", getDessertByIdController);

export default client;

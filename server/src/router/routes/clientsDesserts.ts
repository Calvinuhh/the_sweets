import { Router } from "express";
import { getDessertsController } from "../../controllers/clientsDessertsController";

const clientDesserts: Router = Router();

clientDesserts.get("/", getDessertsController);

export default clientDesserts;

import { Router } from "express";
import {
  sendEmailClientController,
  sendEmailRequestController,
} from "../../controllers/emailsController";

const emailsRouter: Router = Router();

emailsRouter.post("/send", sendEmailClientController);
emailsRouter.post("/send-request", sendEmailRequestController);

export default emailsRouter;

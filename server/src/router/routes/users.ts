import { Router } from "express";
import {
  registerController,
  confirmRegistrationController,
  loginController,
} from "../../controllers/usersController";
import {
  validateUserRegistration,
  validateTokenConfirmation,
} from "../../middlewares/usersMiddlewares";

const usersRouter: Router = Router();

usersRouter.post("/register", validateUserRegistration, registerController);
usersRouter.post(
  "/register/confirm",
  validateTokenConfirmation,
  confirmRegistrationController
);
usersRouter.post("/login", loginController);

export default usersRouter;

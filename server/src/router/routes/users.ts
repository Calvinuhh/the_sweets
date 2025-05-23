import { Router } from "express";
import {
  registerController,
  confirmRegistrationController,
  loginController,
  getUserByIdController,
  patchUserDataController,
} from "../../controllers/usersController";
import {
  validateUserRegistration,
  validateTokenConfirmation,
  validateLogin,
  searchUserByIdWithAuthorization,
  patchUserData,
} from "../../middlewares/usersMiddlewares";

const usersRouter: Router = Router();

usersRouter.post("/register", validateUserRegistration, registerController);

usersRouter.post(
  "/register/confirm",
  validateTokenConfirmation,
  confirmRegistrationController
);

usersRouter.post("/login", validateLogin, loginController);

// usersRouter.get(
//   "/user",
//   searchUserByIdWithAuthorization,
//   getUserByIdController
// );

usersRouter.patch(
  "/user",
  searchUserByIdWithAuthorization,
  patchUserData,
  patchUserDataController
);

export default usersRouter;

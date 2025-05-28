import { Router } from "express";
import {
  registerController,
  confirmRegistrationController,
  loginController,
  getUserByIdController,
  patchUserDataController,
  sendContactFormDataController,
  googleLoginController,
} from "../../controllers/usersController";
import {
  validateUserRegistration,
  validateTokenConfirmation,
  validateLogin,
  searchUserByIdWithAuthorization,
  patchUserData,
  validateContactForm,
  validateGoogleLogin,
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

usersRouter.post("/google-login", validateGoogleLogin, googleLoginController);

usersRouter.patch(
  "/user",
  searchUserByIdWithAuthorization,
  patchUserData,
  patchUserDataController
);

usersRouter.post(
  "/contact-form",
  validateContactForm,
  sendContactFormDataController
);

export default usersRouter;

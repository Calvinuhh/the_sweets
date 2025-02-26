import { Router } from "express";
import {
  authController,
  createUserController,
  loginController,
} from "../../controllers/usersController";
import { validateNewUser } from "../../middlewares/inputValidations";

const authRouter: Router = Router();

authRouter.post("/register", validateNewUser, createUserController);
authRouter.post("/login", loginController);
authRouter.get("/:token", authController);
authRouter.get("/user");

export default authRouter;

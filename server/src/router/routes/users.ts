import { Router } from "express";
import { registerController } from "../../controllers/usersController";
import { validateUserRegistration } from "../../middlewares/usersMiddlewares";

const usersRouter: Router = Router();

usersRouter.post("/register", validateUserRegistration, registerController);
usersRouter.post("/login");

export default usersRouter;

import { Router } from "express";
import { createUserController } from "../../controllers/usersController";
import { validateNewUser } from "../../middlewares/inputValidations";

const authRouter: Router = Router();

authRouter.post("/register", validateNewUser, createUserController);
authRouter.post("/login");
authRouter.get("/:token");
authRouter.get("/user");

export default authRouter;

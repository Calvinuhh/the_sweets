import { Router } from "express";
import { loginController } from "../../controllers/adminController";

const adminRouter: Router = Router();

adminRouter.post("/login", loginController);

export default adminRouter;

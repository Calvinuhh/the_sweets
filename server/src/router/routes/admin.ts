import { Router } from "express";
import {
  authController,
  loginController,
} from "../../controllers/adminController";
import { adminAuthorization } from "../../middlewares/adminAuthorization";

const adminRouter: Router = Router();

adminRouter.post("/login", loginController);
adminRouter.get("/auth", adminAuthorization, authController);

export default adminRouter;

import { Router } from "express";
import {
  changePasswordController,
  loginController,
} from "../../controllers/adminController";
import { validateNewPassword } from "../../middlewares/patchValidations";

process.loadEnvFile();
const { TOKEN } = process.env as { TOKEN: string };

const adminRouter: Router = Router();

adminRouter.post("/login", loginController);
adminRouter.post(`/${TOKEN}`, validateNewPassword, changePasswordController);

export default adminRouter;

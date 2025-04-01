import { Router } from "express";
import dessertsRouter from "./routes/desserts";
import adminRouter from "./routes/admin";
import clientsDesserts from "./routes/clientsDesserts";
import additionsRouter from "./routes/additions";
import emailsRouter from "./routes/emails";

const router: Router = Router();

router.use("/admin", adminRouter);
router.use("/desserts", dessertsRouter);
router.use("/clients", clientsDesserts);
router.use("/additions", additionsRouter);
router.use("/email", emailsRouter);

export default router;

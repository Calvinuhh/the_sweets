import { Router } from "express";
import dessertsRouter from "./routes/desserts";
import adminRouter from "./routes/admin";

const router: Router = Router();

router.use("/admin", adminRouter);
router.use("/desserts", dessertsRouter);

export default router;

import { Router } from "express";
import dessertsRouter from "./routes/desserts";
import adminRouter from "./routes/admin";
import clientsDesserts from "./routes/clientsDesserts";

const router: Router = Router();

router.use("/admin", adminRouter);
router.use("/desserts", dessertsRouter);
router.use("/clients", clientsDesserts);

export default router;

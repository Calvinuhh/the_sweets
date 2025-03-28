import { Router } from "express";
import dessertsRouter from "./routes/desserts";
import adminRouter from "./routes/admin";
import clientsDesserts from "./routes/clientsDesserts";
import additionsRouter from "./routes/additions";

const router: Router = Router();

router.use("/admin", adminRouter);
router.use("/desserts", dessertsRouter);
router.use("/clients", clientsDesserts);
router.use("/additions", additionsRouter);

export default router;

import { Router } from "express";
import authRouter from "./routes/auth";
import dessertsRouter from "./routes/desserts";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/desserts", dessertsRouter);

export default router;

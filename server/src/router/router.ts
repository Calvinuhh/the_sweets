import { Router } from "express";
import testRouter from "./routes/test";

const router: Router = Router();

router.use("/test", testRouter);

export default router;
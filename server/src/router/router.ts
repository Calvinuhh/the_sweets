import { Router } from "express";
import dessertsRouter from "./routes/desserts";
import adminRouter from "./routes/admin";
import clients from "./routes/clients";
import additionsRouter from "./routes/additions";
import usersRouter from "./routes/users";

const router: Router = Router();

router.use("/admin", adminRouter);
router.use("/desserts", dessertsRouter);
router.use("/clients", clients);
router.use("/additions", additionsRouter);
router.use("/users", usersRouter);

export default router;

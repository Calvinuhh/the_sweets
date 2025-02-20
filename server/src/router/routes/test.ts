import { Request, Response, Router } from "express";

const testRouter: Router = Router();

testRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send("desde /test");
});

export default testRouter;

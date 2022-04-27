import express, { Router, Request, Response } from "express";

import rolesRouter from "./rolesRouter";

const apiRouter: Router = express.Router();

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("You have reached the API");
});

apiRouter.use("/roles", rolesRouter);

export default apiRouter;

import express, { Router, Request, Response } from "express";

const apiRouter: Router = express.Router();

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("You have reached the API");
});

export default apiRouter;

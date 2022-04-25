import express, { Application, Request, Response } from "express";

const app: Application = express();

app.get("/", (_req: Request, res: Response): void => {
  res.send("Hello World");
});

export default app;

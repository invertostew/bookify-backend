import express, { Application } from "express";

import apiRouter from "./routes/apiRouter";
import errorHandler from "./middleware/errorHandler";

const app: Application = express();

app.use(express.json());
app.use("/api", apiRouter);
app.use(errorHandler);

export default app;

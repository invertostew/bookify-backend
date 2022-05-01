import express, { Application } from "express";
import cors from "cors";

import apiRouter from "./routes/apiRouter";
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);
app.use(errorHandler);

export default app;

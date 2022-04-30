import express, { Application } from "express";
import cors from "cors";

import apiRouter from "./routes/apiRouter";
import errorHandler from "./middleware/errorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use(errorHandler);

export default app;

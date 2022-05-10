import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";

import apiRouter from "./routes/apiRouter";
import stripeRouter from "./routes/stripeRouter";
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();

app.use(helmet());
app.use(cors());

app.use("/api", apiRouter);
app.use("/stripe", stripeRouter);

app.use(errorHandler);

export default app;

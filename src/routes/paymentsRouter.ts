import express, { Router } from "express";

import * as paymentsController from "../controllers/paymentsController";
import verifyAuthToken from "../middlewares/verifyAuthToken";
import isSuperUser from "../middlewares/isSuperUser";

const paymentsRouter: Router = express.Router();

paymentsRouter.use(verifyAuthToken, isSuperUser);

paymentsRouter.get("/", paymentsController.index);
paymentsRouter.get("/:id", paymentsController.show);

export default paymentsRouter;

import express, { Router } from "express";

import * as rolesController from "../controllers/rolesController";
import verifyAuthToken from "../middlewares/verifyAuthToken";
import isSuperUser from "../middlewares/isSuperUser";

const rolesRouter: Router = express.Router();

const middlewares = [verifyAuthToken, isSuperUser];

rolesRouter
  .route("/")
  .get(middlewares, rolesController.index)
  .post(middlewares, rolesController.create);

rolesRouter
  .route("/:id")
  .get(rolesController.show)
  .put(middlewares, rolesController.update)
  .delete(middlewares, rolesController.destroy);

export default rolesRouter;

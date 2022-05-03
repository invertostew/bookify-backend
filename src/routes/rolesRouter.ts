import express, { Router } from "express";

import * as rolesController from "../controllers/rolesController";
import verifyAuthToken from "../middlewares/verifyAuthToken";
import isSuperUser from "../middlewares/isSuperUser";

const rolesRouter: Router = express.Router();

const ROLES_ROUTER_MIDDLEWARE = [verifyAuthToken, isSuperUser];

rolesRouter.use("/", ROLES_ROUTER_MIDDLEWARE);

rolesRouter.route("/").get(rolesController.index).post(rolesController.create);

rolesRouter
  .route("/:id")
  .get(rolesController.show)
  .put(rolesController.update)
  .delete(rolesController.destroy);

export default rolesRouter;

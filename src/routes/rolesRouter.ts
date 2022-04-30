import express, { Router } from "express";

import * as rolesController from "../controllers/rolesController";
import verifyAuthToken from "../middleware/verifyAuthToken";

const rolesRouter: Router = express.Router();

rolesRouter
  .route("/")
  .get(verifyAuthToken, rolesController.index)
  .post(verifyAuthToken, rolesController.create);

rolesRouter
  .route("/:id")
  .get(verifyAuthToken, rolesController.show)
  .put(verifyAuthToken, rolesController.update)
  .delete(verifyAuthToken, rolesController.destroy);

export default rolesRouter;

import express, { Router } from "express";

import * as rolesController from "../controllers/rolesController";

const rolesRouter: Router = express.Router();

rolesRouter.route("/").get(rolesController.index).post(rolesController.create);

rolesRouter
  .route("/:id")
  .get(rolesController.show)
  .put(rolesController.update)
  .delete(rolesController.destroy);

export default rolesRouter;

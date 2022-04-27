import express, { Router } from "express";

import * as usersController from "../controllers/usersController";

const usersRouter: Router = express.Router();

usersRouter.route("/").get(usersController.index).post(usersController.create);

usersRouter
  .route("/:id")
  .get(usersController.show)
  .put(usersController.update)
  .delete(usersController.destroy);

export default usersRouter;

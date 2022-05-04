import express, { Router } from "express";

import * as usersController from "../controllers/usersController";
import verifyAuthToken from "../middlewares/verifyAuthToken";
import isSuperUser from "../middlewares/isSuperUser";

const usersRouter: Router = express.Router();

const middlewares = [verifyAuthToken, isSuperUser];

usersRouter
  .route("/")
  .get(middlewares, usersController.index)
  .post(usersController.create);

// come back and ensure can only show, update or destroy their own user
usersRouter
  .route("/:id")
  .get(usersController.show)
  .put(usersController.update)
  .delete(usersController.destroy);

usersRouter.post("/authenticate", usersController.authenticate);

export default usersRouter;

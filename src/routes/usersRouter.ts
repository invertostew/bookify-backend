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

// eslint-disable-next-line prettier/prettier
usersRouter
  .route("/:id/calendars")
  .get(usersController.listUserCalendars);

usersRouter
  .route("/:id/calendars/:calendarId")
  .get(usersController.showUserCalendar);

// eslint-disable-next-line prettier/prettier
usersRouter
  .route("/authenticate")
  .post(usersController.authenticate);

export default usersRouter;

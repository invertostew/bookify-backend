import express, { Router } from "express";

import * as usersController from "../controllers/usersController";
import verifyAuthToken from "../middlewares/verifyAuthToken";
import isSuperUser from "../middlewares/isSuperUser";
import belongsToUser from "../middlewares/belongsToUser";

const usersRouter: Router = express.Router();

usersRouter
  .route("/")
  .get(verifyAuthToken, isSuperUser, usersController.index)
  .post(usersController.create);

usersRouter
  .route("/:id")
  .get(verifyAuthToken, belongsToUser, usersController.show)
  .put(verifyAuthToken, belongsToUser, usersController.update)
  .delete(verifyAuthToken, belongsToUser, usersController.destroy);

usersRouter.get("/:id/calendars", usersController.listUserCalendars);

usersRouter.get("/:id/calendars/:calendarId", usersController.showUserCalendar);

usersRouter.post("/authenticate", usersController.authenticate);

export default usersRouter;

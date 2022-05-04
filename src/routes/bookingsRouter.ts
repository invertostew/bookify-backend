import express, { Router } from "express";

import * as bookingsController from "../controllers/bookingsController";

const bookingsRouter: Router = express.Router();

bookingsRouter
  .route("/")
  .get(bookingsController.index)
  .post(bookingsController.create);

bookingsRouter
  .route("/:id")
  .get(bookingsController.show)
  .put(bookingsController.update)
  .delete(bookingsController.destroy);

export default bookingsRouter;

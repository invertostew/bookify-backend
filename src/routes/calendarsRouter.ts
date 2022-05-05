import express, { Router } from "express";

import * as calendarsController from "../controllers/calendarsController";

const calendarsRouter: Router = express.Router();

calendarsRouter
  .route("/")
  .get(calendarsController.index)
  .post(calendarsController.create);

calendarsRouter
  .route("/:id")
  .get(calendarsController.show)
  .put(calendarsController.update)
  .delete(calendarsController.destroy);

export default calendarsRouter;

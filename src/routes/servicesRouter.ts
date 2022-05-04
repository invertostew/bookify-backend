import express, { Router } from "express";

import * as servicesController from "../controllers/servicesController";

const servicesRouter: Router = express.Router();

servicesRouter
  .route("/")
  .get(servicesController.index)
  .post(servicesController.create);

servicesRouter
  .route("/:id")
  .get(servicesController.show)
  .put(servicesController.update)
  .delete(servicesController.destroy);

export default servicesRouter;

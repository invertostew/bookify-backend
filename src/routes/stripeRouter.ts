import express, { Router } from "express";

import {
  stripeCheckoutSession,
  stripeCheckoutUpdate
} from "../controllers/stripeController";

const stripeRouter: Router = express.Router();

stripeRouter.post(
  "/create-checkout-session",
  express.json(),
  stripeCheckoutSession
);

stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeCheckoutUpdate
);

export default stripeRouter;

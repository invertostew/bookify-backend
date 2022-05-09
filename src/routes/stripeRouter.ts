import express, { Router } from "express";

import {
  createCheckoutSession,
  updatePaymentStatus
} from "../controllers/stripeController";

const stripeRouter: Router = express.Router();

stripeRouter.post("/create-checkout-session", createCheckoutSession);

stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  updatePaymentStatus
);

export default stripeRouter;

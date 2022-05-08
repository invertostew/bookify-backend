import express, { Router } from "express";

import createCheckoutSession from "../controllers/stripeController";

const stripeRouter: Router = express.Router();

stripeRouter.post("/create-checkout-session", createCheckoutSession);

export default stripeRouter;

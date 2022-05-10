import Stripe from "stripe";

const { STRIPE_SECRET_KEY } = process.env;

const stripeApi = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: "2020-08-27"
});

export default stripeApi;

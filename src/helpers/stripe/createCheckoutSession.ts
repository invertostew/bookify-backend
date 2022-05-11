import Stripe from "stripe";

import stripeApi from "./stripeApi";

const { CLIENT_URL } = process.env;

interface Metadata {
  user_id: number;
  service_id: number;
  booking_id: number;
}

const createCheckoutSession = async (
  serviceTitle: string,
  serviceDescription: string,
  servicePrice: number,
  customerEmailAddress: string,
  metadata: Metadata
): Promise<Stripe.Response<Stripe.Checkout.Session>> => {
  const lineItem = {
    price_data: {
      currency: "gbp",
      product_data: {
        name: serviceTitle,
        description: serviceDescription
      },
      unit_amount: servicePrice
    },
    quantity: 1
  };

  const session = await stripeApi.checkout.sessions.create({
    success_url: `${CLIENT_URL}/checkout-success?id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${CLIENT_URL}/checkout-failed`,
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [lineItem],
    customer_email: customerEmailAddress,
    shipping_address_collection: { allowed_countries: ["GB"] },
    metadata: {
      user_id: metadata.user_id,
      service_id: metadata.service_id,
      booking_id: metadata.booking_id
    }
  });

  return session;
};

export default createCheckoutSession;

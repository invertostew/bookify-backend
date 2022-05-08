import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";

import { Service, ServiceStore } from "../models/ServiceStore";
import { Payment, PaymentStore } from "../models/PaymentStore";
import { Booking, BookingStore } from "../models/BookingStore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2020-08-27"
});

const { CLIENT_URL } = process.env;

const serviceStore = new ServiceStore();
const paymentStore = new PaymentStore();
const bookingStore = new BookingStore();

const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let service!: Service;

  try {
    service = await serviceStore.show(Number(req.body.service_id));
  } catch (err) {
    next(err);
  }

  try {
    const lineItem = {
      price_data: {
        currency: "gbp",
        product_data: {
          name: service.title
        },
        unit_amount: service.price
      },
      quantity: 1
    };

    const session = await stripe.checkout.sessions.create({
      success_url: `${CLIENT_URL}/success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/cancel`,
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [lineItem],
      metadata: {
        user_id: req.body.user_id,
        service_id: req.body.service_id
      }
    });

    const STRIPE_PAYMENT_INTENT = session.payment_intent;
    const STRIPE_AMOUT_TOTAL = session.amount_total;
    const STRIPE_PAYMENT_STATUS = session.payment_status;

    if (
      !STRIPE_PAYMENT_INTENT ||
      !STRIPE_AMOUT_TOTAL ||
      !STRIPE_PAYMENT_STATUS
    ) {
      throw new Error("Not enough detail to make a payment");
    }

    const payment: Payment = {
      stripe_reference: STRIPE_PAYMENT_INTENT as string,
      total: STRIPE_AMOUT_TOTAL,
      payment_status: STRIPE_PAYMENT_STATUS
    };

    const newPayment = await paymentStore.create(payment);

    const booking: Booking = {
      booking: req.body.booking,
      user_id: req.body.user_id,
      service_id: req.body.service_id,
      payment_id: newPayment.id as number
    };

    await bookingStore.create(booking);

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    next(err);
  }
};

export default createCheckoutSession;

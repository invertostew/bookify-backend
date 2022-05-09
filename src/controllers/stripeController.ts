import Stripe from "stripe";
import { Request, Response, NextFunction } from "express";

import { User, UserStore } from "../models/UserStore";
import { Service, ServiceStore } from "../models/ServiceStore";
import { Payment, PaymentStore } from "../models/PaymentStore";
import { Booking, BookingStore } from "../models/BookingStore";
import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";
import Logger from "../classes/logger/Logger";

const { STRIPE_SECRET_KEY, CLIENT_URL, STRIPE_ENDPOINT_SECRET } = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: "2020-08-27"
});

const userStore = new UserStore();
const serviceStore = new ServiceStore();
const paymentStore = new PaymentStore();
const bookingStore = new BookingStore();

const logger = new Logger("stripe_logs.txt");

export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user!: User;
  let service!: Service;

  try {
    user = await userStore.show(Number(req.body.user_id));
  } catch (err) {
    next(err);
  }

  try {
    service = await serviceStore.show(Number(req.body.service_id));
  } catch (err) {
    next(err);
  }

  try {
    const LINE_ITEM = {
      price_data: {
        currency: "gbp",
        product_data: {
          name: service.title,
          description: service.description
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
      line_items: [LINE_ITEM],
      customer_email: user.email_address,
      shipping_address_collection: { allowed_countries: ["GB"] },
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
      throw new BadRequestError("instance", "type", "title", "detail");
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
    logger.error(err);

    next(err);
  }
};

export const updatePaymentStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const PAYLOAD = req.body;
    const STRIPE_SIGNATURE = req.headers["stripe-signature"];

    if (!PAYLOAD || !STRIPE_SIGNATURE || STRIPE_ENDPOINT_SECRET) {
      throw new BadRequestError("instance", "type", "title", "detail");
    }

    const event = stripe.webhooks.constructEvent(
      PAYLOAD,
      STRIPE_SIGNATURE,
      STRIPE_ENDPOINT_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(session);
      // update payment status based on stripe_reference / payment intent
    }

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);

    next(err);
  }
};

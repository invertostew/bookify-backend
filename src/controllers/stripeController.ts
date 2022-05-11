import { Request, Response, NextFunction } from "express";

import stripeApi from "../helpers/stripe/stripeApi";
import createBooking from "../helpers/stripe/createBooking";
import createCheckoutSession from "../helpers/stripe/createCheckoutSession";
import createPayment from "../helpers/stripe/createPayment";
import updateBookingPaymentId from "../helpers/stripe/updateBookingPaymentId";
import updatePaymentStatus from "../helpers/stripe/updatePaymentStatus";

import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";
import Logger from "../classes/logger/Logger";

const logger = new Logger("stripe_logs.txt");

export const stripeCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { booking, user_id: userId, service_id: serviceId } = req.body;

  if (!booking || !userId || !serviceId) {
    throw new BadRequestError("instance", "type", "title", "detail");
  }

  try {
    // initial booking with no payment_id
    const initialBooking = await createBooking(userId, serviceId, booking, res);

    const { title, description, price } = res.locals.service;
    const { email_address: emailAddress } = res.locals.user;

    const metadata = {
      user_id: initialBooking.user_id,
      service_id: initialBooking.service_id,
      booking_id: initialBooking.id as number
    };

    // start stripe checkout session
    const checkoutSession = await createCheckoutSession(
      title,
      description,
      price,
      emailAddress,
      metadata
    );

    const {
      payment_intent: paymentIntent,
      amount_total: amountTotal,
      payment_status: paymentStatus
    } = checkoutSession;

    if (!paymentIntent || !amountTotal || !paymentStatus) {
      throw new Error("Stripe issue... Required!");
    }

    // now create a payment with status unpaid
    const unpaidPayment = await createPayment(
      paymentIntent.toString(),
      amountTotal,
      paymentStatus
    );

    // assign initialBooking with an unpaid payment ID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unpaidBooking = await updateBookingPaymentId(
      initialBooking.booking,
      initialBooking.user_id,
      initialBooking.service_id,
      unpaidPayment.id as number,
      initialBooking.id as number
    );

    if (!checkoutSession.url) {
      throw new Error("Stripe issue... Required!");
    }

    // res.redirect(checkoutSession.url);
    res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    logger.debug(err);

    next(err);
  }
};

export const stripeCheckoutUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const signature = req.headers["stripe-signature"];
    const { STRIPE_ENDPOINT_SECRET } = process.env;

    if (!payload || !signature || !STRIPE_ENDPOINT_SECRET) {
      throw new BadRequestError("instance", "type", "title", "detail");
    }

    const event = stripeApi.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_ENDPOINT_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const stripeObject = event.data.object as any;

      // log for heroku
      console.error(stripeObject.payment_status);
      console.error(stripeObject.metadata);

      if (!stripeObject.payment_intent || !stripeObject.payment_status) {
        throw new Error("Can't proceed.");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const completedPayment = await updatePaymentStatus(
        stripeObject.payment_status,
        stripeObject.payment_intent
      );
    } else {
      throw new Error("This is an unhandled event");
    }

    res.sendStatus(200);
  } catch (err) {
    // log for heroku
    console.log(err);

    logger.debug(err);

    next(err);
  }
};

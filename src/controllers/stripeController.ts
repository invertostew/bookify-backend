import { Request, Response, NextFunction } from "express";

import stripeApi from "../helpers/stripe/stripeApi";
import createBooking from "../helpers/stripe/createBooking";
import createCheckoutSession from "../helpers/stripe/createCheckoutSession";
import createPayment from "../helpers/stripe/createPayment";
import updateBookingPaymentId from "../helpers/stripe/updateBookingPaymentId";
import updatePaymentStatus from "../helpers/stripe/updatePaymentStatus";

import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";
import Logger from "../classes/logger/Logger";

const { SERVER_URL } = process.env;

const logger = new Logger("stripe_logs.txt");

export const stripeCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { booking, user_id: userId, service_id: serviceId } = req.body;

  if (!booking || !userId || !serviceId) {
    throw new BadRequestError(
      `${SERVER_URL}${req.baseUrl}${req.path}`,
      `${SERVER_URL}/api/problem/req-body-missing`,
      "Request body is missing properties",
      `Ensure that the request body contains 'booking', 'user_id', and 'service_id' properties`
    );
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
      payment_intent: stripeReference,
      amount_total: total,
      payment_status: paymentStatus
    } = checkoutSession;

    if (!stripeReference || !total || !paymentStatus) {
      throw new Error(
        "Stripe response is missing 'payment_intent', 'amount_total', or 'payment_status'"
      );
    }

    // now create a payment with status unpaid
    const unpaidPayment = await createPayment(
      stripeReference.toString(),
      total,
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
      throw new Error("Stripe response is missing 'url'");
    }

    // res.redirect(checkoutSession.url);
    res.json({ url: checkoutSession.url });
  } catch (err: unknown) {
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
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains a 'payload' property`
      );
    }

    const event = stripeApi.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_ENDPOINT_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const stripeObject = event.data.object as any;

      const { payment_status: paymentStatus, payment_intent: stripeReference } =
        stripeObject;

      if (!paymentStatus || !stripeReference) {
        throw new Error(
          "Stripe event is missing 'payment_status' or 'payment_intent'"
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const completedPayment = await updatePaymentStatus(
        paymentStatus,
        stripeReference
      );
    } else {
      throw new Error(
        "We are not currently handling this type of Stripe event."
      );
    }

    res.sendStatus(200);
  } catch (err: unknown) {
    logger.debug(err);

    next(err);
  }
};

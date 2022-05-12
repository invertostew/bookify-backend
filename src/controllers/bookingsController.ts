import { Request, Response, NextFunction } from "express";

import { Booking, BookingStore } from "../models/BookingStore";
import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";

const { SERVER_URL } = process.env;

const store = new BookingStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookings = await store.index();

    res.json(bookings);
  } catch (err: unknown) {
    next(err);
  }
};

export const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (Number.isNaN(parseInt(id.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/parameter-is-nan`,
        "Request parameter 'id' is NaN",
        `The id '${id}' is not a number`
      );
    }

    const booking = await store.show(+id);

    res.json(booking);
  } catch (err: unknown) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      booking: bookingDateTime,
      user_id: userId,
      service_id: serviceId,
      payment_id: paymentId
    } = req.body;

    if (!bookingDateTime || !userId || !serviceId) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains 'booking', 'user_id', and 'service_id' properties`
      );
    }

    if (
      Number.isNaN(parseInt(userId.toString(), 10)) ||
      Number.isNaN(parseInt(serviceId.toString(), 10))
    ) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-property-is-nan`,
        "Request body property 'user_id' or 'service_id' is NaN",
        `Ensure that user_id '${userId}' and service_id '${serviceId}' are numbers`
      );
    }

    const booking: Booking = {
      booking: bookingDateTime,
      user_id: userId,
      service_id: serviceId,
      payment_id: paymentId
    };

    const newBooking = await store.create(booking);

    res.status(201).json(newBooking);
  } catch (err: unknown) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (Number.isNaN(parseInt(id.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/parameter-is-nan`,
        "Request parameter 'id' is NaN",
        `The id '${id}' is not a number`
      );
    }

    const {
      booking: bookingDateTime,
      user_id: userId,
      service_id: serviceId,
      payment_id: paymentId
    } = req.body;

    if (!bookingDateTime || !userId || !serviceId) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains 'booking', 'user_id', and 'service_id' properties`
      );
    }

    if (
      Number.isNaN(parseInt(userId.toString(), 10)) ||
      Number.isNaN(parseInt(serviceId.toString(), 10))
    ) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-property-is-nan`,
        "Request body property 'user_id' or 'service_id' is NaN",
        `Ensure that user_id '${userId}' and service_id '${serviceId}' are numbers`
      );
    }

    const booking: Booking = {
      id: +id,
      booking: bookingDateTime,
      user_id: userId,
      service_id: serviceId,
      payment_id: paymentId
    };

    const updatedBooking = await store.update(booking);

    res.json(updatedBooking);
  } catch (err: unknown) {
    next(err);
  }
};

export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (Number.isNaN(parseInt(id.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/parameter-is-nan`,
        "Request parameter 'id' is NaN",
        `The id '${id}' is not a number`
      );
    }

    const deletedBooking = await store.destroy(+id);

    res.json(deletedBooking);
  } catch (err: unknown) {
    next(err);
  }
};

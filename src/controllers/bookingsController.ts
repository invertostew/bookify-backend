import { Request, Response, NextFunction } from "express";

import { Booking, BookingStore } from "../models/BookingStore";
import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";

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
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (Number.isNaN(id)) {
      throw new BadRequestError("instance", "type", "string", "detail");
    }

    const booking = await store.show(id);

    res.json(booking);
  } catch (err: unknown) {
    next(err);
  }
};

export const create = async (
  req: Request<
    {},
    {},
    {
      booking: string;
      user_id: number;
      service_id: number;
      payment_id: number | null;
    },
    {}
  >,
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
      throw new BadRequestError("instance", "type", "string", "detail");
    }

    if (Number.isNaN(userId) || Number.isNaN(serviceId)) {
      throw new BadRequestError("instance", "type", "string", "detail");
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
  req: Request<
    { id: number },
    {},
    {
      id: number;
      booking: string;
      user_id: number;
      service_id: number;
      payment_id: number | null;
    },
    {}
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      id: bookingId,
      booking: bookingDateTime,
      user_id: userId,
      service_id: serviceId,
      payment_id: paymentId
    } = req.body;

    if (!bookingId || !bookingDateTime || !userId || !serviceId) {
      throw new BadRequestError("instance", "type", "string", "detail");
    }

    if (
      Number.isNaN(bookingId) ||
      Number.isNaN(userId) ||
      Number.isNaN(serviceId)
    ) {
      throw new BadRequestError("instance", "type", "string", "detail");
    }

    const booking: Booking = {
      id: bookingId,
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
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (Number.isNaN(id)) {
      throw new BadRequestError("instance", "type", "string", "detail");
    }

    const deletedBooking = await store.destroy(id);

    res.json(deletedBooking);
  } catch (err: unknown) {
    next(err);
  }
};

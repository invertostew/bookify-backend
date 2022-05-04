import { Request, Response, NextFunction } from "express";

import { Booking, BookingStore } from "../models/BookingStore";

const store = new BookingStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookings = await store.index();

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

export const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking = await store.show(Number(req.params.id));

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking: Booking = {
      booking: req.body.booking,
      user_id: req.body.user_id,
      service_id: req.body.service_id,
      payment_id: req.body.payment_id
    };

    const newBooking = await store.create(booking);

    res.status(201).json(newBooking);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking: Booking = {
      id: Number(req.params.id),
      booking: req.body.booking,
      user_id: req.body.user_id,
      service_id: req.body.service_id,
      payment_id: req.body.payment_id
    };

    const updatedBooking = await store.update(booking);

    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedBooking = await store.destroy(Number(req.params.id));

    res.status(200).json(deletedBooking);
  } catch (err) {
    next(err);
  }
};

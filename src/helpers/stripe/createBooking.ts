import { Response } from "express";

import { UserStore } from "../../models/UserStore";
import { ServiceStore } from "../../models/ServiceStore";
import { Booking, BookingStore } from "../../models/BookingStore";

const createBooking = async (
  userId: number,
  serviceId: number,
  bookingDateTime: string,
  res: Response
): Promise<Booking> => {
  const userStore = new UserStore();
  const serviceStore = new ServiceStore();
  const bookingStore = new BookingStore();

  const user = await userStore.show(Number(userId));
  const service = await serviceStore.show(Number(serviceId));
  const booking = await bookingStore.create({
    booking: bookingDateTime,
    user_id: userId,
    service_id: serviceId,
    payment_id: null
  });

  res.locals.user = user;
  res.locals.service = service;
  res.locals.booking = booking;

  return booking;
};

export default createBooking;

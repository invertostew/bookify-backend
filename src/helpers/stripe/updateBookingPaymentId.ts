import { Booking, BookingStore } from "../../models/BookingStore";

const updateBookingPaymentId = async (
  bookingDateTime: string,
  userId: number,
  serviceId: number,
  paymentId: number,
  bookingId: number
): Promise<Booking> => {
  const bookingStore = new BookingStore();

  const booking = await bookingStore.update({
    booking: bookingDateTime,
    user_id: userId,
    service_id: serviceId,
    payment_id: paymentId,
    id: bookingId
  });

  return booking;
};

export default updateBookingPaymentId;

import { Payment, PaymentStore } from "../../models/PaymentStore";

const updatePaymentStatus = async (
  paymentStatus: string,
  stripeReference: string
): Promise<Payment> => {
  const paymentStore = new PaymentStore();

  const payment = paymentStore.updatePaymentStatus(
    paymentStatus,
    stripeReference
  );

  return payment;
};

export default updatePaymentStatus;

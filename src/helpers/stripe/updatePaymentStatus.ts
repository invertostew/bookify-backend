import { Payment, PaymentStore } from "../../models/PaymentStore";

const updatePaymentStatus = async (
  paymentStatus: string,
  paymentId: number
): Promise<Payment> => {
  const paymentStore = new PaymentStore();

  const payment = paymentStore.updatePaymentStatus(paymentStatus, paymentId);

  return payment;
};

export default updatePaymentStatus;

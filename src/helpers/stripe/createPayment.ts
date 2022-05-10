import { Payment, PaymentStore } from "../../models/PaymentStore";

const createPayment = async (
  paymentIntent: string,
  amountTotal: number,
  paymentStatus: string
): Promise<Payment> => {
  const paymentStore = new PaymentStore();

  const payment: Payment = {
    stripe_reference: paymentIntent,
    total: amountTotal,
    payment_status: paymentStatus
  };

  const unpaidPayment = paymentStore.create(payment);

  return unpaidPayment;
};

export default createPayment;

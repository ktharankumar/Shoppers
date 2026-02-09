export function createPaymentIntent({ orderId, amount }) {
  const paymentId = `pay_${Math.floor(Math.random() * 900000) + 100000}`;
  return { paymentId, orderId, amount, status: "PENDING" };
}

export function confirmPayment({ paymentId }) {
  return { paymentId, status: "SUCCESS" };
}

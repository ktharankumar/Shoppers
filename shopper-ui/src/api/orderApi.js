export function createOrderFromCart({ userId, cart }) {
  // MVP simulation — replace later with order-service POST /orders/checkout
  const orderId = Math.floor(Math.random() * 900000) + 100000;
  return {
    orderId,
    userId,
    total: cart?.cartTotal ?? 0,
    status: "PENDING_PAYMENT"
  };
}

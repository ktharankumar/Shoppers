import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmPayment } from "../api/paymentApi";

function money(n) {
  const num = Number(n ?? 0);
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(num);
}

export default function PaymentPage({ setToast }) {
  const nav = useNavigate();
  const { state } = useLocation();

  const order = state?.order;
  const payment = state?.payment;

  if (!order || !payment) {
    return (
      <main className="container">
        <div className="panel">
          <div className="panel-title">No payment context</div>
          <div className="muted">Go to checkout again.</div>
          <button className="btn" onClick={() => nav("/checkout")}>Checkout</button>
        </div>
      </main>
    );
  }

  async function payNow() {
    try {
      const res = confirmPayment({ paymentId: payment.paymentId });
      if (res.status === "SUCCESS") {
        nav("/success", { state: { order, payment: { ...payment, status: "SUCCESS" } } });
      } else {
        setToast?.({ type: "error", title: "Payment failed", message: "Try again" });
      }
    } catch (e) {
      setToast?.({ type: "error", title: "Payment failed", message: e.message });
    }
  }

  return (
    <main className="container">
      <div className="page-head row-between">
        <div>
          <div className="title">Payment</div>
          <div className="muted">MVP simulation page</div>
        </div>
        <button className="btn btn-ghost" onClick={() => nav("/checkout")}>Back</button>
      </div>

      <div className="panel">
        <div className="panel-title">Pay Now</div>

        <div className="kv">
          <div className="k">Order ID</div><div className="v">{order.orderId}</div>
          <div className="k">Payment ID</div><div className="v">{payment.paymentId}</div>
          <div className="k">Amount</div><div className="v strong">{money(payment.amount)}</div>
          <div className="k">Status</div><div className="v">{payment.status}</div>
        </div>

        <button className="btn btn-wide" onClick={payNow}>Pay Now (Simulate Success)</button>

        <div className="hint">
          Later: replace this with real payment-service + webhook flow.
        </div>
      </div>
    </main>
  );
}

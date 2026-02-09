import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const order = state?.order;
  const payment = state?.payment;

  return (
    <main className="container">
      <div className="panel success">
        <div className="panel-title">✅ Order Confirmed</div>
        <div className="muted">MVP simulated confirmation</div>

        <div className="kv">
          <div className="k">Order ID</div><div className="v">{order?.orderId ?? "—"}</div>
          <div className="k">Payment</div><div className="v">{payment?.paymentId ?? "—"} ({payment?.status ?? "—"})</div>
        </div>

        <div className="row">
          <button className="btn" onClick={() => nav("/")}>Continue Shopping</button>
          <button className="btn btn-ghost" onClick={() => nav("/cart")}>Go to Cart</button>
        </div>
      </div>
    </main>
  );
}

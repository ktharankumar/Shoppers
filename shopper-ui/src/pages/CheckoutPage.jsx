import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../api/cartApi";
import { createOrderFromCart } from "../api/orderApi";
import { createPaymentIntent } from "../api/paymentApi";
import Loader from "../components/Loader.jsx";

function money(n) {
  const num = Number(n ?? 0);
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(num);
}

export default function CheckoutPage({ setToast }) {
  const nav = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const c = await getCart();
        setCart(c);
      } catch (e) {
        setErr(e.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function proceed() {
    try {
      const order = createOrderFromCart({ userId: 1, cart });
      const payment = createPaymentIntent({ orderId: order.orderId, amount: order.total });

      // pass state to payment page
      nav("/payment", { state: { order, payment } });
    } catch (e) {
      setToast?.({ type: "error", title: "Checkout failed", message: e.message });
    }
  }

  if (loading) return <Loader label="Preparing checkout..." />;

  if (err) {
    return (
      <main className="container">
        <div className="panel">
          <div className="panel-title">Checkout failed</div>
          <div className="muted">{err}</div>
          <button className="btn" onClick={() => nav("/cart")}>Back to cart</button>
        </div>
      </main>
    );
  }

  const items = cart?.items ?? [];
  const total = cart?.cartTotal ?? 0;

  return (
    <main className="container">
      <div className="page-head row-between">
        <div>
          <div className="title">Checkout</div>
          <div className="muted">Review and proceed to payment</div>
        </div>
        <button className="btn btn-ghost" onClick={() => nav("/cart")}>Back to cart</button>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-title">Items</div>
          {items.length ? (
            <div className="list">
              {items.map((it) => (
                <div key={it.itemId ?? it.productId} className="list-row">
                  <div>
                    <div className="strong">{it.productName || `Product ${it.productId}`}</div>
                    <div className="muted">Qty: {it.quantity}</div>
                  </div>
                  <div className="strong">{money(it.totalPrice ?? 0)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted">Cart is empty.</div>
          )}
        </div>

        <div className="panel">
          <div className="panel-title">Summary</div>
          <div className="list">
            <div className="list-row">
              <div className="muted">Cart Total</div>
              <div className="strong">{money(total)}</div>
            </div>
            <div className="list-row">
              <div className="muted">Shipping</div>
              <div className="strong">{money(0)}</div>
            </div>
            <div className="divider" />
            <div className="list-row">
              <div className="strong">Payable</div>
              <div className="strong">{money(total)}</div>
            </div>
          </div>

          <button className="btn btn-wide" onClick={proceed} disabled={!items.length}>
            Proceed to Payment
          </button>

          <div className="hint">
            Note: Payment/Order services are not built yet — this is MVP simulation UI.
          </div>
        </div>
      </div>
    </main>
  );
}

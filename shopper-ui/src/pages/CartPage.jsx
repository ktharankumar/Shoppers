import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, addItem, reduceItem, removeItem } from "../api/cartApi";
import CartTable from "../components/CartTable.jsx";
import Loader from "../components/Loader.jsx";

export default function CartPage({ setToast }) {
  const nav = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const c = await getCart();
      setCart(c);
    } catch (e) {
      setErr(e.message || "Failed to load cart");
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function inc(productId) {
    try {
      const updated = await addItem(undefined, productId, 1);
      setCart(updated);
    } catch (e) {
      setToast?.({ type: "error", title: "Update failed", message: e.message });
    }
  }

  async function dec(productId) {
    try {
      const updated = await reduceItem(undefined, productId, 1);
      setCart(updated);
    } catch (e) {
      setToast?.({ type: "error", title: "Update failed", message: e.message });
    }
  }

  async function remove(productId) {
    try {
      const updated = await removeItem(undefined, productId);
      setCart(updated);
      setToast?.({ type: "success", title: "Removed", message: `Product ${productId} removed` });
    } catch (e) {
      setToast?.({ type: "error", title: "Remove failed", message: e.message });
    }
  }

  return (
    <main className="container">
      <div className="page-head row-between">
        <div>
          <div className="title">Your Cart</div>
          <div className="muted">User: 1 (MVP hardcoded)</div>
        </div>
        <div className="row">
          <button className="btn btn-ghost" onClick={load}>Refresh</button>
          <button className="btn" onClick={() => nav("/checkout")} disabled={!cart?.items?.length}>
            Checkout
          </button>
        </div>
      </div>

      {err ? (
        <div className="panel">
          <div className="panel-title">Couldn’t load cart</div>
          <div className="muted">{err}</div>
          <button className="btn" onClick={load}>Retry</button>
        </div>
      ) : loading ? (
        <Loader label="Loading cart..." />
      ) : (
        <CartTable cart={cart} onInc={inc} onDec={dec} onRemove={remove} />
      )}
    </main>
  );
}

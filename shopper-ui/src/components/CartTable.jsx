import React from "react";

function money(n) {
  const num = Number(n ?? 0);
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(num);
}

export default function CartTable({ cart, onInc, onDec, onRemove }) {
  const items = cart?.items ?? [];

  if (!items.length) {
    return (
      <div className="panel">
        <div className="panel-title">Cart is empty</div>
        <div className="muted">Add products from the Products page.</div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-title">Items</div>

      <div className="table">
        <div className="trow thead">
          <div>Product</div>
          <div>Qty</div>
          <div>Unit</div>
          <div>Total</div>
          <div></div>
        </div>

        {items.map((it) => (
          <div key={it.itemId ?? it.productId} className="trow">
            <div>
              <div className="strong">{it.productName || `Product ${it.productId}`}</div>
              <div className="muted">ID: {it.productId}</div>
            </div>

            <div className="qty">
              <button className="btn btn-mini" onClick={() => onDec(it.productId)}>-</button>
              <div className="strong">{it.quantity}</div>
              <button className="btn btn-mini" onClick={() => onInc(it.productId)}>+</button>
            </div>

            <div className="strong">{money(it.unitPrice ?? 0)}</div>
            <div className="strong">{money(it.lineTotal ?? 0)}</div>

            <div>
              <button className="btn btn-danger" onClick={() => onRemove(it.productId)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="row-between totalbar">
        <div className="strong">Cart Total</div>
        <div className="strong">{money(cart?.cartTotal ?? 0)}</div>
      </div>
    </div>
  );
}

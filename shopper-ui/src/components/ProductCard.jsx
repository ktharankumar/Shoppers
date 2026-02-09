import React from "react";

function money(n) {
  const num = Number(n ?? 0);
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(num);
}

export default function ProductCard({ p, onOpen, onAddToCart }) {
  return (
    <div className="card">
      <div className="card-top">
        <div className="badge">{p.category || "OTHER"}</div>
        <div className={`avail ${p.isAvailable ? "avail-yes" : "avail-no"}`}>
          {p.isAvailable ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      <div className="card-name" onClick={() => onOpen(p.id)} role="button" tabIndex={0}>
        {p.productName || "Unnamed product"}
      </div>

      <div className="card-spec">{p.specifications || "—"}</div>

      <div className="price-row">
        <div className="price">{money(p.finalPrice ?? p.price)}</div>
        {p.discountPercentage ? <div className="strike">{money(p.price)}</div> : null}
      </div>

      <button
        className="btn btn-wide"
        disabled={!p.isAvailable}
        onClick={() => onAddToCart?.(p.id)}
      >
        Add to Cart
      </button>
    </div>
  );
}

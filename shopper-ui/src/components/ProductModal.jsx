import React from "react";
import Loader from "./Loader.jsx";

function money(n) {
  const num = Number(n ?? 0);
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(num);
}

export default function ProductModal({ open, onClose, loading, error, product, onAddToCart }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Product</div>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>

        <div className="modal-body">
          {loading ? <Loader label="Loading..." /> : null}
          {error ? <div className="panel"><div className="panel-title">Error</div><div className="muted">{error}</div></div> : null}

          {!loading && !error && product ? (
            <>
              <div className="row-between">
                <div className="badge">{product.category || "OTHER"}</div>
                <div className={`avail ${product.isAvailable ? "avail-yes" : "avail-no"}`}>
                  {product.isAvailable ? "In Stock" : "Out of Stock"}
                </div>
              </div>

              <h2 className="h2">{product.productName}</h2>
              <div className="muted">{product.specifications || "—"}</div>

              <div className="divider" />

              <div className="row-between">
                <div>
                  <div className="muted">Final Price</div>
                  <div className="modal-price">{money(product.finalPrice ?? product.price)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="muted">Discount</div>
                  <div className="strong">{product.discountPercentage ? `${product.discountPercentage}%` : "—"}</div>
                </div>
              </div>

              <div className="divider" />

              <button className="btn btn-wide" disabled={!product.isAvailable} onClick={onAddToCart}>
                Add to Cart
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

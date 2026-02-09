import React from "react";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, onOpen, onAddToCart }) {
  if (!products.length) {
    return (
      <div className="panel">
        <div className="panel-title">No products found</div>
        <div className="muted">Try a different category or search.</div>
      </div>
    );
  }
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} onOpen={onOpen} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

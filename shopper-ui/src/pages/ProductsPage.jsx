import React, { useEffect, useMemo, useState } from "react";
import { CATEGORIES, getProduct, getProducts } from "../api/productApi";
import { addItem } from "../api/cartApi";

import CategoryBar from "../components/CategoryBar.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import ProductModal from "../components/ProductModal.jsx";
import Loader from "../components/Loader.jsx";

export default function ProductsPage({ setToast }) {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalErr, setModalErr] = useState("");

  async function loadProducts() {
    setErr("");
    setLoading(true);
    try {
      const data = await getProducts(category || undefined);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Failed to load products");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const name = (p.productName || "").toLowerCase();
      const spec = (p.specifications || "").toLowerCase();
      return name.includes(q) || spec.includes(q);
    });
  }, [items, query]);

  async function openProduct(id) {
    setSelectedId(id);
    setSelectedProduct(null);
    setModalErr("");
    setModalLoading(true);
    try {
      const p = await getProduct(id);
      setSelectedProduct(p);
    } catch (e) {
      setModalErr(e.message || "Failed to load product");
    } finally {
      setModalLoading(false);
    }
  }

  async function addToCartQuick(productId) {
    try {
      await addItem(undefined, productId, 1);
      setToast?.({ type: "success", title: "Added to cart", message: `Product ${productId} added` });
    } catch (e) {
      setToast?.({ type: "error", title: "Add to cart failed", message: e.message });
    }
  }

  return (
    <>
      <div className="subheader">
        <div className="container row-between">
          <div className="title">Products</div>
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name/specs…"
          />
        </div>
      </div>

      <CategoryBar categories={CATEGORIES} selected={category} onSelect={setCategory} />

      <main className="container">
        {err ? (
          <div className="panel">
            <div className="panel-title">Couldn’t load products</div>
            <div className="muted">{err}</div>
            <button className="btn" onClick={loadProducts}>Retry</button>
          </div>
        ) : loading ? (
          <Loader label="Loading products..." />
        ) : (
          <ProductGrid products={filtered} onOpen={openProduct} onAddToCart={addToCartQuick} />
        )}
      </main>

      <ProductModal
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        loading={modalLoading}
        error={modalErr}
        product={selectedProduct}
        onAddToCart={selectedProduct ? () => addToCartQuick(selectedProduct.id) : null}
      />
    </>
  );
}

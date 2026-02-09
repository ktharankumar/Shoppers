import React from "react";

export default function CategoryBar({ categories, selected, onSelect }) {
  return (
    <div className="categorybar">
      <div className="container row">
        <button className={`pill ${selected === "" ? "pill-active" : ""}`} onClick={() => onSelect("")}>
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`pill ${selected === c ? "pill-active" : ""}`}
            onClick={() => onSelect(c)}
          >
            {c.replaceAll("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}

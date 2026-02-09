import React from "react";

export default function Loader({ label }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <div className="muted">{label}</div>
    </div>
  );
}

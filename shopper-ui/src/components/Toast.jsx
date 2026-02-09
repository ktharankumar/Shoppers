import React from "react";

export default function Toast({ title, message, type = "info", onClose }) {
  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-head">
        <div className="strong">{title}</div>
        <button className="btn btn-mini" onClick={onClose}>x</button>
      </div>
      <div className="muted">{message}</div>
    </div>
  );
}

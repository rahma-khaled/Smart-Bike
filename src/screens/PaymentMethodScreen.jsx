import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';

export default 
function PaymentMethodScreen({ navigate }) {
  const [selected, setSelected] = useState(null);
  const methods = [
    { id: "apple", logo: "🍎 Pay", name: "Apple Pay", sub: "Fast & Secure" },
    { id: "fawry", logo: "fawry", name: "Fawry", sub: "Fast & Secure" },
  ];
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("payment")} />
          <div className="page-title">Payment Method</div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>Digital Wallets</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {methods.map(m => (
            <div key={m.id} className={`payment-method-item ${selected === m.id ? "selected" : ""}`} onClick={() => setSelected(m.id)}>
              <div style={{ width: 52, height: 36, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{m.logo}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                <div style={{ color: "#888", fontSize: 12 }}>{m.sub}</div>
              </div>
              <div className={`radio-circle ${selected === m.id ? "selected" : ""}`} />
            </div>
          ))}
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>Saved Cards</div>
        <div className={`payment-method-item ${selected === "mc" ? "selected" : ""}`} style={{ marginBottom: 16 }} onClick={() => setSelected("mc")}>
          <div style={{ display: "flex", gap: -8 }}>
            <div style={{ width: 26, height: 26, background: "#EB001B", borderRadius: "50%" }} />
            <div style={{ width: 26, height: 26, background: "#F79E1B", borderRadius: "50%", marginLeft: -12 }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Mastercard</div>
            <div style={{ color: "#888", fontSize: 12 }}>****3956</div>
          </div>
          <div className={`radio-circle ${selected === "mc" ? "selected" : ""}`} />
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: DARK, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontFamily: "'Space Grotesk',sans-serif" }}>
          + Add New Card
        </button>
        <button className="btn-primary" onClick={() => navigate("paymentSuccess")}>Pay Now</button>
      </div>
    </div>
  );
}
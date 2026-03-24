import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';

export default 
function PaymentSuccessScreen({ navigate, state }) {
  const ride = state?.user?.currentRide || { elapsedSeconds: 0, cost: "0.00" };
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const vCashNumber = state?.user?.paymentMethod?.number || "";
  const maskedPhone = vCashNumber ? `***${vCashNumber.slice(-4)}` : "Account Linked";
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 20 }}>Confirm Payment</div>
          <div style={{ width: 72, height: 72, background: "#f0f0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "popIn 0.4s" }}>
            <Icons.CheckIcon size={40} color={DARK} />
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>Payment Successful!</div>
          <p style={{ color: "#888", marginTop: 8 }}>Thank you for your ride</p>
        </div>
        <div className="card" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Receipt</span>
            <span style={{ color: "#888", fontSize: 14 }}>{new Date().toLocaleDateString()}</span>
          </div>
          {[["Transaction ID", `#BK${Math.floor(Math.random()*90000)+10000}`], ["Duration", fmt(ride.elapsedSeconds)], ["Rate", "0.50 EGP/min"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#888", fontSize: 14 }}>{k}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e8e8e8", marginTop: 10, paddingTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700 }}>Total paid</span>
              <span style={{ fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{ride.cost} EGP</span>
            </div>
            <div style={{ color: "#888", fontSize: 13, textAlign: "right", marginTop: 4 }}>Vodafone Cash: {maskedPhone}</div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate("map")}>Back To Home</button>
      </div>
    </div>
  );
}
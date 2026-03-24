import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';

export default 
function PaymentScreen({ navigate, state }) {
  const [selected, setSelected] = useState("vodafone");
  const ride = state?.user?.currentRide || { elapsedSeconds: 0, cost: "0.00" };
  const vCashNumber = state?.user?.paymentMethod?.number || "Not Linked";
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "white" }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("rideComplete")} />
          <div className="page-title">Payment</div>
        </div>
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12 }}>Rental Summary</div>
          {[
            ["Bike", `Bike #${state.selectedBike?.id || 'Active'}`], 
            ["Actual Duration", `${Math.floor(ride.elapsedSeconds / 60)}:${String(ride.elapsedSeconds % 60).padStart(2, '0')}`], 
            ["Rate", "0.50 EGP/min"]
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#888", fontSize: 14 }}>{k}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e8e8e8", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700 }}>Total</span>
            <span style={{ fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{ride.cost} EGP</span>
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>Payment Method</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <div className={`payment-method-item selected`} onClick={() => setSelected("vodafone")}>
            <div style={{ width: 40, height: 40, background: "#ce1126", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              <Icons.PhoneIcon size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Vodafone Cash</div>
              <div style={{ color: "#888", fontSize: 12 }}>Linked: {vCashNumber}</div>
            </div>
            <div className={`radio-circle selected`} />
          </div>
          <button className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => navigate("editProfile")}>
            + Change Vodafone Number
          </button>
        </div>
        <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("paymentSuccess")}>Continue To Payment</button>
      </div>
    </div>
  );
}
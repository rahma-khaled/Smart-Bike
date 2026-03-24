import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';
import localforage from 'localforage';

export default 
function RideCompleteScreen({ navigate, state }) {
  const [checked, setChecked] = useState(true);

  // Save the completed ride data asynchronously to the user's permanent profile
  useEffect(() => {
    async function saveRide() {
      if (!state?.user?.phone || !state?.user?.currentRide) return;
      try {
        const users = await localforage.getItem('app_users') || [];
        const updated = users.map(u => {
          if (u.phone === state.user.phone) {
            const history = u.rideHistory || [];
            // Prevent duplicate save via timestamp ID
            const rideId = state.user.currentRide.date;
            if (!history.find(r => r.date === rideId)) {
              return { ...u, rideHistory: [state.user.currentRide, ...history] };
            }
          }
          return u;
        });
        await localforage.setItem('app_users', updated);
      } catch (err) {
        console.error("Failed to save ride history", err);
      }
    }
    saveRide();
  }, [state?.user?.phone, state?.user?.currentRide]);

  const ride = state?.user?.currentRide || { elapsedSeconds: 0, cost: "0.00" };
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
          <div className="success-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.CheckIcon size={40} color={DARK} />
          </div>
          <div className="page-title" style={{ fontSize: 26 }}>Ride Completed!</div>
          <p className="page-subtitle">Here's your ride summary</p>
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12 }}>Ride Summary</div>
          {[["Bike", state?.selectedBike?.id || "B005"], ["Duration", fmt(ride.elapsedSeconds)], ["Rate", "0.50 EGP/min"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#888", fontSize: 14 }}>{k}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>Total Cost</span>
            <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Space Grotesk',sans-serif", color: DARK }}>{ride.cost} EGP</span>
          </div>
          <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Billable to your Linked Account</div>
        </div>
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 24 }}
          onClick={() => setChecked(!checked)}
        >
          <div style={{ width: 28, height: 28, border: `2px solid ${checked ? DARK : "#ddd"}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: checked ? DARK : "white", flexShrink: 0 }}>
            {checked && <Icons.CheckIcon size={16} color="white" />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>The bike is in good condition</div>
            <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>Please confirm that the bike has no damage and is properly parked</div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate("payment")}>Proceed To Payment</button>
      </div>
    </div>
  );
}
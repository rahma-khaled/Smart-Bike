import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';

export default 
function HistoryScreen({ navigate, state }) {
  const rides = state?.user?.rideHistory?.length > 0 
    ? state.user.rideHistory.map(r => ({
        status: "Completed",
        date: new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        from: "Damietta Station A",
        to: "Damietta Station B",
        amount: `${r.cost} EGP`
      }))
    : [];

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("map")} />
          <div className="page-title">Ride History</div>
        </div>
        {rides.length > 0 ? rides.map((r, i) => (
          <div key={i} className="history-card">
            <span className={`status-badge ${r.status === "Completed" ? "badge-completed" : "badge-canceled"}`}>{r.status}</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>{r.date}<br />{r.time}</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 2 }}>
                    <div style={{ width: 10, height: 10, background: DARK, borderRadius: "50%" }} />
                    <div style={{ width: 1.5, height: 20, background: "#aaa", margin: "3px 0" }} />
                    <div style={{ width: 10, height: 10, background: "#888", borderRadius: "50%", border: "2px solid #aaa" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.from}</div>
                    <div style={{ color: "#888", fontSize: 13, marginTop: 16 }}>{r.to}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #ebebeb", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>{r.amount}</span>
              <Icons.ChevronRightIcon size={18} color="#aaa" />
            </div>
          </div>
        )) : (
          <div style={{ textAlign: "center", padding: "60px 20px", opacity: 0.5 }}>
            <Icons.BikeIconSVG size={56} color={DARK} />
            <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>No Rides Yet</div>
            <div style={{ color: "#555", marginTop: 8 }}>Your completed trips and receipts will appear here.</div>
            <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => navigate("map")}>Find a Bike</button>
          </div>
        )}
      </div>
    </div>
  );
}
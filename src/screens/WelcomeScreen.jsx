import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';

export default 
function WelcomeScreen({ navigate, state }) {
  useEffect(() => {
    if (state.user?.status === 'pending') {
      navigate('statusDashboard');
    }
  }, [state.user?.status, navigate]);

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: LIME, padding: "60px 28px 60px", borderRadius: "0 0 48px 48px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Icons.BikeLogo size={64} color={DARK} />
        <div style={{ fontSize: 38, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: DARK, marginTop: 16 }}>Smart Bike</div>
      </div>
      <div style={{ padding: "48px 28px 32px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <button className="btn-primary" onClick={() => navigate("register")}>Create Account</button>
        <button className="btn-secondary" onClick={() => navigate("login")}>Login</button>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';

export default 
function ScanCompleteScreen({ navigate }) {
  useEffect(() => { const t = setTimeout(() => navigate("pendingApproval"), 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "white", padding: 32 }}>
      <div className="success-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icons.CheckIcon size={40} color={DARK} />
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", textAlign: "center", marginTop: 24 }}>Capture Success!</h2>
      <p style={{ color: "#888", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>Your ID details have been submitted for review.</p>
      <div style={{ marginTop: 40, width: "100%" }}>
        <button className="btn-primary" onClick={() => navigate("pendingApproval")}>Continue</button>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';

export default 
function VerifyLockScreen({ navigate }) {
  const [taken, setTaken] = useState(false);
  const [status, setStatus] = useState(null);

  function handlePhoto() {
    setTaken(true);
    setTimeout(() => {
      setStatus(Math.random() > 0.5 ? "verified" : "warning");
    }, 1000);
  }

  return (
    <div style={{ height: "100%", background: "#111", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button style={{ width: 40, height: 40, background: "white", border: "none", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => navigate("riding")}>
          <Icons.ChevronLeftIcon size={20} color={DARK} />
        </button>
        <span style={{ color: "white", fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>Verify Bike Lock</span>
        <button style={{ width: 40, height: 40, background: "white", border: "none", borderRadius: 12, cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icons.ZapIcon size={20} color={DARK} />
        </button>
      </div>
      <div style={{ height: "55%", background: taken ? "linear-gradient(135deg, #c0a080 0%, #908060 100%)" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {taken ? <Icons.BikeIconSVG size={80} color="white" /> : <Icons.CameraIcon size={40} color="white" />}
      </div>
      <div className="qr-frame" style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)" }}>
        <div className="qr-corner tl" />
        <div className="qr-corner tr" />
        <div className="qr-corner bl" />
        <div className="qr-corner br" />
      </div>
      {!status && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 40px", display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ color: "white", textAlign: "center", fontSize: 14, marginBottom: 8 }}>Take a photo of your locked bike</p>
          <button className="btn-primary" onClick={handlePhoto}>Take photo</button>
          <button className="btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Icons.AlertTriangleIcon size={18} color="white" /> Need Help?
          </button>
        </div>
      )}
      {status === "warning" && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, background: "#fff0c0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icons.AlertTriangleIcon size={32} color="#f39c12" />
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Warning: Your bike is unlocked!</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Your bike is not secured. please lock it!</p>
              <button className="btn-primary" onClick={() => { setStatus(null); setTaken(false); }}>Retake photo</button>
            </div>
          </div>
        </div>
      )}
      {status === "verified" && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, background: "#e8ffc0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icons.CheckIcon size={32} color="#2e7d32" />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Bike Lock Verified</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Your bike is safely locked</p>
              <button className="btn-primary" onClick={() => navigate("rideComplete")}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
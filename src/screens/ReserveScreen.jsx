import React, { useEffect } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';

export default 
function ReserveScreen({ navigate, state, setState }) {
  useEffect(() => {
    if (state.user?.status && state.user.status !== 'verified') {
      navigate('statusDashboard');
    }
  }, [state.user?.status, navigate]);

  const handleReserve = () => {
    setState(s => ({
      ...s,
      user: {
        ...s.user,
        activeReservation: {
          bikeId: state.selectedBike?.id || 'B005',
          expiresAt: Date.now() + 15 * 60000 // 15 minutes
        }
      }
    }));
    navigate("reserved");
  };

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("map")} />
          <div className="page-title">Reserve Bike</div>
        </div>
        
        <div style={{ background: "#f8f8f8", borderRadius: 16, padding: 20, marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, background: LIME, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.BikeIconSVG size={32} color={DARK} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Space Grotesk',sans-serif" }}>
              Bike {state.selectedBike?.id || "B005"}
            </div>
            <div style={{ color: "#666", fontSize: 14, marginTop: 4 }}>Damietta Fleet</div>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ background: "rgba(204, 255, 0, 0.15)", border: `1px solid ${LIME}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: DARK, marginBottom: 8 }}>
              <Icons.ClockIcon size={18} color={DARK} /> 15-Minute Free Hold
            </div>
            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.5 }}>
              You can hold this bike remotely for 15 minutes at no cost. You must arrive at the bike and scan to unlock before the timer expires, otherwise the bike will be released automatically.
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={handleReserve} style={{ position: "absolute", bottom: 32, left: 24, right: 24 }}>
          Confirm Free Reservation
        </button>
      </div>
    </div>
  );
}
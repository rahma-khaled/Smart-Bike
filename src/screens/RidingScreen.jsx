import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';
import LeafletMap from '../features/telemetry/LeafletMap';
import localforage from 'localforage';

export default 
function RidingScreen({ navigate, state, setState }) {
  const [showEmergency, setShowEmergency] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [checkingZone, setCheckingZone] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (state.user?.status && state.user.status !== 'verified' && state.user.status !== 'approved') {
      navigate('statusDashboard');
    }
  }, [state.user?.status, navigate]);

  useEffect(() => {
    const t = setInterval(() => {
      setElapsedSeconds(p => {
        const next = p + 1;
        // Live Tracking: Update bike coordinates every 60 seconds
        if (next > 0 && next % 60 === 0) {
          navigator.geolocation.getCurrentPosition((pos) => {
            setState(s => ({
              ...s,
              bikes: s.bikes.map(b => b.id === s.selectedBike?.id ? { ...b, lat: pos.coords.latitude, lng: pos.coords.longitude } : b)
            }));
          }, () => {}, { enableHighAccuracy: true });
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [setState]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", zIndex: 0 }}>
        <LeafletMap bikes={[]} />
      </div>
      <div style={{ position: "absolute", top: 14, left: 0, right: 0, padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <button style={{ width: 40, height: 40, borderRadius: 12, background: "white", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icons.MenuIcon size={20} color={DARK} />
        </button>
        <div style={{ background: LIME, borderRadius: 50, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>
          <span style={{ width: 8, height: 8, background: DARK, borderRadius: "50%", display: "inline-block" }} />
          Ride in Progress
        </div>
      </div>
      <div style={{ position: "absolute", top: 80, left: 16, right: 16, background: "white", borderRadius: 20, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 10 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#888", fontSize: 12, fontWeight: 600 }}>Elapsed Time</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: DARK }}>{fmt(elapsedSeconds)}</div>
          </div>
          <div style={{ width: 1, background: "#eee" }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: "#888", fontSize: 12, fontWeight: 600 }}>Est. Cost (0.50/min)</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>
              {(Math.ceil((elapsedSeconds / 60) * 0.50 * 100) / 100).toFixed(2)} <span style={{fontSize:12, fontWeight:600}}>EGP</span>
            </div>
          </div>
        </div>
        <div className="ride-progress-bar" style={{ marginTop: 12 }}>
          {/* Animated pulse line for active ride */}
          <div className="ride-progress-fill" style={{ width: "100%", transformOrigin: "left", animation: "pulse 2s infinite ease-in-out" }} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "120px", left: 16, zIndex: 10 }}>
        <button className="emergency-btn" onClick={() => setShowShare(true)}>
          <Icons.ExternalLinkIcon size={20} color={DARK} />
        </button>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 32px", display: "flex", flexDirection: "column", gap: 10, zIndex: 10 }}>
        <button className="btn-danger" onClick={() => {
          setCheckingZone(true);
          setTimeout(() => {
            setCheckingZone(false);
            setShowEndConfirm(true);
          }, 1500);
        }} disabled={checkingZone}>
          {checkingZone ? "Verifying GPS Parking Zone..." : "Unlock & End Ride"}
        </button>
        <button className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "white", borderColor: "#FF3B30", color: "#FF3B30", fontWeight: 700 }} onClick={async () => {
           const lat = state.userLocation?.lat || 0;
           const lng = state.userLocation?.lng || 0;
           console.log(`[ADMIN_LOG] EMERGENCY SOS at [${lat}, ${lng}]`);
           try {
             const logs = await localforage.getItem('admin_logs') || [];
             logs.unshift({
               timestamp: new Date().toISOString(),
               operator: state.user?.name || state.user?.phone || 'Unknown User',
               action: 'EMERGENCY SOS TRIGGERED',
               details: `Coordinates: [${lat}, ${lng}]`,
               isSystem: true
             });
             await localforage.setItem('admin_logs', logs);
           } catch(e) { console.error('Failed to log SOS', e); }
           setShowEmergency(true);
        }}>
          <Icons.ShieldAlertIcon size={18} color="#FF3B30" /> EMERGENCY SOS
        </button>
      </div>

      {showEmergency && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card" style={{ margin: "0 24px" }}>
            <div style={{ textAlign: "center", paddingBottom: 8 }}>
              <div style={{ width: 60, height: 60, background: "#fff0c0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icons.AlertTriangleIcon size={32} color="#f39c12" />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Emergency Alerted</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Help is on the way. Calling support...</p>
              <button className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }} onClick={() => { setShowEmergency(false); navigate("calling"); }}>
                <Icons.PhoneIcon size={18} color="currentColor" /> Call Emergency Services
              </button>
              <button className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => setShowEmergency(false)}>
                <Icons.XIcon size={18} color="currentColor" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEndConfirm && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, background: "#ffe0e0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icons.LogOutIcon size={32} color="#FF3B30" />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Zone Verified. End ride?</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>You are securely parked. Your ride will stop and charges will be finalized.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button style={{ flex: 1, padding: "14px", background: "#FF3B30", color: "white", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", fontSize: 15 }} onClick={() => { 
                    setState(s => ({
                      ...s,
                      user: {
                        ...s.user,
                        activeReservation: null, // Clear hold
                        currentRide: {
                          elapsedSeconds,
                          cost: (Math.ceil((elapsedSeconds / 60) * 0.50 * 100) / 100).toFixed(2),
                          date: new Date().toISOString()
                        }
                      }
                    }));
                    setShowEndConfirm(false); 
                    navigate("verifyLock"); 
                  }}>Confirm</button>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowEndConfirm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {showShare && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="sheet-handle" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div className="page-title" style={{ fontSize: 20 }}>Share Your Ride</div>
              <button style={{ background: "none", border: "none", cursor: "pointer", display: 'flex' }} onClick={() => setShowShare(false)}>
                <Icons.XIcon size={20} color="#888" />
              </button>
            </div>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Choose how you want to share your location</p>
            <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: "#f0f0f0", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <Icons.ExternalLinkIcon size={20} color={DARK} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Share Ride Location</div>
                  <div style={{ color: "#888", fontSize: 12 }}>Send your live ride location to friends</div>
                </div>
              </div>
              <Icons.ChevronRightIcon size={16} color="#aaa" />
            </div>
            <div style={{ background: "#f5fde0", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Icons.ShieldCheckIcon size={18} color="#2e7d32" />
              <span style={{ fontSize: 12, color: "#666" }}>Your privacy matters. you control who sees your location and when.</span>
            </div>
            <div style={{ background: "#f0f0f0", borderRadius: 12, padding: 14, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Sharing live ride location</div>
              <div style={{ color: "#888", fontSize: 12 }}>Damietta, Egypt</div>
            </div>
            <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>SHARE VIA</div>
            <div className="share-apps">
              {[
                { name: "WhatsApp", icon: <Icons.MessageSquareIcon size={20} color="white" />, bg: "#25D366" },
                { name: "Messages", icon: <Icons.MessageSquareIcon size={20} color="white" />, bg: "#34aadc" },
                { name: "Messenger", icon: <Icons.MessageSquareIcon size={20} color="white" />, bg: "#a259ff" },
                { name: "More", icon: <Icons.MoreHorizontalIcon size={20} color={DARK} />, bg: "#e0e0e0" }
              ].map((app) => (
                <div key={app.name} className="share-app" onClick={() => setShowShare(false)}>
                  <div className="share-app-icon" style={{ background: app.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {app.icon}
                  </div>
                  <span className="share-app-name">{app.name}</span>
                </div>
              ))}
            </div>
            {[
              { label: "Instagram Stories", icon: <Icons.CameraIcon size={22} color={DARK} /> },
              { label: "Twitter / X", icon: <Icons.ShareIcon size={22} color={DARK} /> },
              { label: "Copy Link", icon: <Icons.LinkIcon size={22} color={DARK} /> }
            ].map((opt) => (
              <div key={opt.label} className="share-option" onClick={() => setShowShare(false)}>
                <div style={{ width: 44, height: 44, background: "#f0f0f0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {opt.icon}
                </div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
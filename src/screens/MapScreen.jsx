import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';
import LeafletMap from '../features/telemetry/LeafletMap';
import { DAMIETTA_BIKES, DAMIETTA_GEOFENCE, pointInPolygon } from '../features/telemetry/geofence';
import { calculateDistance } from '../features/telemetry/SensorGate.js';

export default 
function MapScreen({ navigate, state, setState }) {
  const [selectedBike, setSelectedBike] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const btnBoxStyle = { width: 44, height: 44, borderRadius: 12, background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" };

  // Watch global reservation timer
  useEffect(() => {
    let interval;
    if (state.user?.activeReservation) {
      const updateTimer = () => {
        const remaining = Math.max(0, state.user.activeReservation.expiresAt - Date.now());
        if (remaining === 0) {
           setState(s => ({ ...s, user: { ...s.user, activeReservation: null } }));
           clearInterval(interval);
        } else {
           setTimeLeft(remaining);
        }
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(interval);
  }, [state.user?.activeReservation, setState]);

  // start GPS tracking
  useEffect(() => {
    let watchId;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Map GPS Error Init:', err),
        { enableHighAccuracy: true }
      );
      watchId = navigator.geolocation.watchPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Map GPS Error:', err),
        { enableHighAccuracy: true }
      );
    }
    // FORCE user location for pure laptop simulation with zero distance to B-LOCAL
    const timeout = setTimeout(() => {
      setUserLocation({ lat: 0, lng: 0 }); // Mock origin [0,0] for laptop simulation
    }, 1000);
    
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeout);
    };
  }, []);

  // deriving bikes from state and inject live test bike
  const displayBikes = React.useMemo(() => {
    const bikes = [...(state.bikes || [])];
    if (userLocation) {
      const idx = bikes.findIndex(b => b.id === 'B-LOCAL');
      // Set test bike coordinates identically to [0, 0] to guarantee Zero Distance math for overrides
      const testBike = { lat: 0, lng: 0, id: "B-LOCAL", name: "My Test Bike", battery: "85 M", status: "Locked", rate: "5 EGP / Hr" };
      if (idx >= 0) bikes[idx] = testBike;
      else bikes.push(testBike);
    }
    return bikes;
  }, [state.bikes, userLocation]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Real Leaflet Map */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", zIndex: 0 }}>
        <LeafletMap bikes={displayBikes} onBikeClick={i => setSelectedBike(i)} selectedBike={selectedBike} userLocation={userLocation} />
      </div>

      {/* Map Empty State Layer */}
      {displayBikes.length === 0 && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 5, textAlign: "center", background: "white", padding: "32px 24px", borderRadius: 24, boxShadow: "0 10px 40px rgba(0,0,0,0.1)", width: "85%" }}>
          <div style={{ width: 80, height: 80, background: "#f5f5f5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icons.BikeIconSVG size={40} color={DARK} className="opacity-40" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: DARK, marginBottom: 8 }}>Area Unavailable</h2>
          <p style={{ color: "#666", fontSize: 14, lineHeight: 1.5 }}>There are no bikes currently deployed in your immediate vicinity. Please check back later or refresh.</p>
        </div>
      )}

      {/* Top bar: Menu + Bell */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", justifyContent: "space-between", padding: "14px 16px 8px" }}>
        <button style={btnBoxStyle} onClick={() => setShowDrawer(true)} aria-label="Open menu">
          <Icons.MenuIcon size={20} />
        </button>
        <button style={{ ...btnBoxStyle, position: "relative" }} onClick={() => navigate("notifications")} aria-label="Notifications">
          <Icons.BellIcon size={20} />
          <span style={{ position: "absolute", top: 6, right: 6, width: 16, height: 16, background: "#FF3B30", borderRadius: "50%", fontSize: 9, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>4</span>
        </button>
      </div>

      {/* Active Reservation Banner */}
      {state.user?.activeReservation && timeLeft > 0 && (
        <div style={{ position: "absolute", top: 80, left: 16, right: 16, background: "rgba(26,26,26,0.9)", backdropFilter: "blur(10px)", border: `1px solid ${LIME}`, borderRadius: 12, padding: 12, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: LIME, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.BikeIconSVG size={20} color={DARK} />
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk',sans-serif" }}>Hold on {state.user.activeReservation.bikeId}</div>
              <div style={{ color: LIME, fontWeight: 700, fontSize: 15 }}>
                {(() => {
                  const m = Math.floor(timeLeft / 60000);
                  const s = Math.floor((timeLeft % 60000) / 1000);
                  return `${m}:${s < 10 ? '0' : ''}${s}`;
                })()} remaining
              </div>
            </div>
          </div>
          <button style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }} onClick={() => setState(s => ({ ...s, user: { ...s.user, activeReservation: null } }))}>
            Cancel
          </button>
        </div>
      )}

      {/* Right-side FABs */}
      <div style={{ position: "absolute", bottom: 90, right: 16, zIndex: 10, display: "flex", flexDirection: "column", gap: 10 }}>
        <button style={btnBoxStyle} aria-label="My location" onClick={() => console.log("Locating user...")}>
          <Icons.LocationIcon size={20} />
        </button>
        <button style={btnBoxStyle} aria-label="Refresh map" onClick={() => { console.log("Refreshing bikes..."); window.location.reload(); }}>
          <Icons.RefreshIcon size={20} />
        </button>
      </div>

      {/* Left-side FAB */}
      <div style={{ position: "absolute", bottom: 90, left: 16, zIndex: 10 }}>
        <button style={btnBoxStyle} aria-label="Support" onClick={() => navigate("legal")}>
          <Icons.HeadsetIcon size={20} />
        </button>
      </div>

      {/* Bottom CTA */}
      {selectedBike === null ? (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 32px", zIndex: 10 }}>
          {(() => {
              const closestBikeDist = userLocation && displayBikes.length > 0 
                ? Math.min(...displayBikes.map(b => calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng))) 
                : Infinity;
              const anyNear = closestBikeDist <= 50 || displayBikes.some(b => b.id === 'B-LOCAL');

            return (
              <button 
                className="btn-primary" 
                disabled={!anyNear}
                style={{ 
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  background: anyNear ? LIME : "#444", color: anyNear ? DARK : "#888", cursor: anyNear ? "pointer" : "not-allowed"
                }} 
                onClick={() => {
                  const local = displayBikes.find(b => b.id === 'B-LOCAL');
                  if (local) setState(s => ({ ...s, selectedBike: local }));
                  navigate("scanQR");
                }}
              >
                <Icons.QRScanIcon size={18} color={anyNear ? DARK : "#888"} /> 
                {anyNear ? "Scan To Ride" : `Too far from any bike (${closestBikeDist > 1000 ? (closestBikeDist/1000).toFixed(1)+'km' : closestBikeDist+'m'})`}
              </button>
            );
          })()}
        </div>
      ) : (
        <div className="bottom-sheet" style={{ zIndex: 10 }}>
          <div className="sheet-handle" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Space Grotesk',sans-serif" }}>Bike #{displayBikes[selectedBike]?.id || ''}</div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ color: "#888", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icons.BatteryIconSVG size={16} color="#888" /> {displayBikes[selectedBike]?.battery} battery
                </span>
                <span style={{ color: "#888", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icons.PadlockIcon size={16} color="#888" /> {displayBikes[selectedBike]?.status || ''}
                </span>
                
                {/* Admin Mode Only -> Technical Info */}
                {state.user?.role === 'super_admin' && (
                  <span style={{ color: "#FF3B30", fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <Icons.AlertIcon size={14} color="#FF3B30" /> 
                    COORD: {displayBikes[selectedBike]?.lat?.toFixed(5)}, {displayBikes[selectedBike]?.lng?.toFixed(5)}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ width: 52, height: 52, background: "#f5f5f5", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.BikeIconSVG size={36} color={DARK} />
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: 'flex' }} onClick={() => setSelectedBike(null)}>
                <Icons.XIcon size={20} color="#888" />
              </button>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {(() => {
              const bike = displayBikes[selectedBike];
              const dist = (userLocation && bike?.lat && bike?.lng)
                ? calculateDistance(userLocation.lat, userLocation.lng, bike.lat, bike.lng)
                : Infinity;
              const isTestBike = bike?.id === 'B-LOCAL' || bike?.id === 'B-TEST';
              const tooFar = isTestBike ? false : dist > 20;

              const isVodafoneLinked = state.user?.paymentMethod?.type === 'Vodafone Cash' && state.user?.paymentMethod?.number;

              if (!isVodafoneLinked) {
                return (
                  <button className="btn-primary" style={{ background: "#f39c12", color: "#111", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => navigate("editProfile")}>
                    <Icons.PhoneIcon size={18} color="#111" /> Add Vodafone Cash to Unlock
                  </button>
                );
              }

              return tooFar ? (
                <button 
                  className="btn-primary" 
                  disabled 
                  style={{ width: "100%", background: "#444", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "not-allowed" }}
                >
                  <Icons.QRScanIcon size={18} color="#888" /> 
                  Advance closer to unlock ({(dist/1000).toFixed(2)}km away)
                </button>
              ) : (
                <button className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => {
                  setState(s => ({ ...s, selectedBike: bike })); // pass explicitly so scanner doesn't guess
                  if (bike.id === 'B-LOCAL' || bike.id === 'B-TEST') {
                    // Force straight to scanner per rule
                    return navigate("scanQR");
                  }
                  navigate("scanQR");
                }}>
                  <Icons.QRScanIcon size={18} color={DARK} /> Scan To Unlock (<Icons.CheckIcon size={14} /> Near)
                </button>
              );
            })()}

            {/* Reservation is REMOTE: allowed from anywhere! */}
            {!(state.user?.paymentMethod?.type === 'Vodafone Cash' && state.user?.paymentMethod?.number) ? (
              <button className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderColor: "#f39c12", color: "#f39c12" }} onClick={() => navigate("editProfile")}>
                <Icons.PhoneIcon size={18} color="#f39c12" /> Add Vodafone Cash to Reserve
              </button>
            ) : (
              <button className="btn-outline" onClick={() => { 
                  if (displayBikes[selectedBike]) {
                    setState(s => ({ ...s, selectedBike: displayBikes[selectedBike] })); 
                    navigate("reserve"); 
                  }
                }}>Reserve (Remote Hold)</button>
            )}
          </div>
        </div>
      )}

      {/* Side Drawer */}
      {showDrawer && (
        <div className="drawer-overlay">
          <div className="drawer-bg" onClick={() => setShowDrawer(false)} />
          <div className="drawer">
            <div style={{ background: LIME, padding: "60px 20px 32px" }}>
              <div 
                style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                onClick={() => { 
                  setShowDrawer(false); 
                  localStorage.setItem('admin_mode', 'true');
                  setState(s => ({ ...s, isAdminMode: true }));
                  navigate('adminDashboard'); 
                }}
                title="Switch to Admin Mode"
              >
                <div className="profile-img" style={{ background: "#fff", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", overflow: "hidden" }}>
                  {state.user.profilePic ? (
                    <img src={state.user.profilePic} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: 64, height: 64, background: DARK, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icons.UserSettingsIcon size={28} color="white" />
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, fontFamily: "'Space Grotesk',sans-serif" }}>{state.user.name || 'User Name'}</div>
                  {state.user.email && <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{state.user.email}</div>}
                </div>
              </div>
              <button className="btn-outline" style={{ marginTop: 16, background: "white", borderColor: DARK }} onClick={() => { setShowDrawer(false); navigate("profile"); }}>View Profile</button>
            </div>
            <div style={{ padding: "16px 0" }}>
              {(() => {
                const items = [
                  { icon: <Icons.BikeIconSVG size={20} color={DARK} />, label: "Rides History", screen: "history" },
                  { icon: <Icons.LocationIcon size={20} color={DARK} />, label: "How To Ride?", screen: "howToRide" },
                  { icon: <Icons.UserSettingsIcon size={20} color={DARK} />, label: "Settings", screen: "settings" },
                  { icon: <Icons.AlertIcon size={20} color="#FF9800" />, label: "Report Issue", screen: "reportIssue" },
                ];
                if (state.user.role === 'admin' || state.user.role === 'super_admin') {
                  items.unshift({ icon: <Icons.UserSettingsIcon size={20} color={DARK} />, label: 'Admin Dashboard', screen: 'adminDashboard' });
                }
                return items.map(item => (
                  <button
                    key={item.label}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: DARK, transition: "background 0.15s" }}
                    onClick={() => { setShowDrawer(false); navigate(item.screen); }}
                  >
                    {item.icon} {item.label}
                  </button>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
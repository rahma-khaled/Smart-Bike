import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import LeafletMap from '../features/telemetry/LeafletMap';
import localforage from 'localforage';
import { simulateDockLock, calculateDistance } from '../features/telemetry/SensorGate.js';

const BASE_FARE    = 0;
const RATE_PER_MIN = 0.50;
const SOS_NUMBER   = "+201022094608";
const DK = '#1a1a2e';  // dark bg
const DK2 = '#16213e'; // darker card
const ACC = '#e94560';  // accent red

const fmtTime = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
};
const calcCost = (secs) => {
  let cost = BASE_FARE + Math.floor(secs / 60) * RATE_PER_MIN;
  if (cost === 0) cost = RATE_PER_MIN;
  return cost.toFixed(2);
};
const fmtDist = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(2)} km`;
const genTxId = () => 'TXN-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

// ─── Component ────────────────────────────────────────────────────────────────
export default function RidingScreen({ navigate, state, setState }) {
  // ── Ride tracking ──
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const prevLocRef = useRef(null);
  const timerRef = useRef(null);
  const rideActive = useRef(true);

  // ── End-ride flow step: null | 'verify' | 'verifying' | 'verified' | 'summary' | 'payment' | 'receipt' ──
  const [endStep, setEndStep] = useState(null);
  const [checkingZone, setCheckingZone] = useState(false);
  const [bikeConditionOk, setBikeConditionOk] = useState(false);
  const [walletNumber, setWalletNumber] = useState(state?.user?.paymentMethod?.number || '');
  const [paying, setPaying] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [photoFailCount, setPhotoFailCount] = useState(0);
  const videoRef = useRef(null);

  // Frozen values at end
  const [finalSeconds, setFinalSeconds] = useState(null);
  const [finalKm, setFinalKm] = useState(null);

  // ── Access guard ──
  useEffect(() => {
    if (state.user?.status && state.user.status !== 'verified' && state.user.status !== 'approved') {
      navigate('statusDashboard');
    }
  }, [state.user?.status, navigate]);

  // ── Camera effect for verify step ──
  useEffect(() => {
    if (endStep === 'verify_camera' || endStep === 'verify_warning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          setCameraStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera error:", err));
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        setCameraStream(null);
      }
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [endStep]);

  // ── Main ride tick ──
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!rideActive.current) return;
      setElapsedSeconds(p => p + 1);
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            setUserLocation({ lat, lng });
            if (prevLocRef.current) {
              const d = calculateDistance(prevLocRef.current.lat, prevLocRef.current.lng, lat, lng);
              if (d > 0.002) setDistanceKm(prev => prev + d / 1000);
            }
            prevLocRef.current = { lat, lng };
            setState(s => ({ ...s, bikes: (s.bikes || []).map(b => b.id === s.selectedBike?.id ? { ...b, lat, lng } : b) }));
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 2000 }
        );
      }
    }, 1000);
    return () => { clearInterval(timerRef.current); rideActive.current = false; };
  }, [setState]);

  const displaySeconds = finalSeconds ?? elapsedSeconds;
  const displayKm = finalKm ?? distanceKm;
  const displayCost = calcCost(displaySeconds);

  // ═══════════════════════════════════════════════════════
  // END-RIDE HANDLERS
  // ═══════════════════════════════════════════════════════

  // Step 0: User clicks End Ride → zone check → open Step 1
  function handleEndRide() {
    setCheckingZone(true);
    // Freeze timer & Trigger lock here based on new instructions
    setFinalSeconds(elapsedSeconds);
    setFinalKm(distanceKm);
    rideActive.current = false;
    clearInterval(timerRef.current);

    setTimeout(async () => {
      setCheckingZone(false);
      
      // Trigger Dock Servo Lock (10°)
      const emptyDock = state.docks?.find(d => !d.occupiedBy) || state.docks?.[0];
      if (emptyDock) {
        await simulateDockLock(emptyDock.id);
        setState(s => ({
          ...s,
          docks: s.docks.map(d => 
            d.id === emptyDock.id 
              ? { ...d, occupiedBy: s.selectedBike?.id || 'B-LOCAL', servoPos: 170 } 
              : (d.occupiedBy === (s.selectedBike?.id || 'B-LOCAL') ? { ...d, occupiedBy: null } : d)
          ),
          bikes: s.bikes.map(b => b.id === (s.selectedBike?.id || 'B-LOCAL') ? { ...b, locked: true, lat: emptyDock.lat, lng: emptyDock.lng } : b)
        }));
      }

      setEndStep('verify_start');
    }, 1000);
  }

  // Step 1 Flow handlers
  function takePhotoCheck() {
    if (photoFailCount === 0) {
      setEndStep('verify_warning');
      setPhotoFailCount(1);
    } else {
      setEndStep('verify_success');
      setTimeout(() => setEndStep('summary'), 2000);
    }
  }

  // Step 2 → Step 3: Proceed to Payment
  function handleProceedPayment() {
    if (!bikeConditionOk) return;
    // Save trip to history
    const cost = calcCost(finalSeconds ?? elapsedSeconds);
    const emptyDock = state.docks?.find(d => d.occupiedBy === (state.selectedBike?.id || 'B-LOCAL')) || state.docks?.[0];
    const newTrip = {
      id: Date.now(), date: new Date().toISOString(), cost,
      duration: fmtTime(finalSeconds ?? elapsedSeconds),
      distanceKm: (finalKm ?? distanceKm).toFixed(2),
      from: state.user?.startDockName || 'Start',
      to: emptyDock?.name || 'End', status: 'Completed'
    };
    setState(s => ({
      ...s,
      user: {
        ...s.user, activeReservation: null, startDockName: null,
        rideHistory: [newTrip, ...(s.user.rideHistory || [])],
        currentRide: { elapsedSeconds: finalSeconds ?? elapsedSeconds, cost, date: new Date().toISOString() }
      }
    }));
    setEndStep('payment_overview');
  }

  // Step 3: Pay via Vodafone Cash
  function handlePay() {
    if (!walletNumber || walletNumber.length < 10) {
      alert('Please enter a valid Vodafone Cash wallet number.');
      return;
    }
    setPaying(true);
    setTimeout(() => {
      setState(s => ({
        ...s,
        bikes: (s.bikes || []).map(b => b.id === (s.selectedBike?.id || 'B-LOCAL') ? { ...b, status: 'available', locked: true, riderPhone: null } : b),
        selectedBike: null
      }));
      setPaying(false);
      setTxnId(genTxId());
      setEndStep('receipt');
    }, 2000);
  }

  // Step 4: Back to Home
  function handleBackHome() {
    navigate('map');
  }

  // ── SOS ──
  async function handleSOS() {
    const lat = prevLocRef.current?.lat || 0;
    const lng = prevLocRef.current?.lng || 0;
    try {
      const logs = await localforage.getItem('admin_logs') || [];
      logs.unshift({ timestamp: new Date().toISOString(), operator: state.user?.name || state.user?.phone || 'Unknown', action: 'EMERGENCY SOS TRIGGERED', details: `Coordinates: [${lat}, ${lng}]`, isSystem: true });
      await localforage.setItem('admin_logs', logs);
    } catch (e) {}
    window.location.href = `tel:${SOS_NUMBER}`;
  }

  // ─── Shared Styles ───
  const lightOverlay = { position: 'absolute', inset: 0, background: '#fff', zIndex: 500, display: 'flex', flexDirection: 'column', fontFamily: "'Space Grotesk', sans-serif" };
  const accentBtn = (disabled) => ({ width: '100%', height: 52, borderRadius: 14, background: disabled ? '#f0f0f0' : ACC, color: disabled ? '#aaa' : 'white', border: 'none', fontWeight: 800, fontSize: 15, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Space Grotesk', sans-serif", transition: 'all 0.2s' });
  const limeBtn = (disabled) => ({ ...accentBtn(disabled), background: disabled ? '#f0f0f0' : LIME, color: disabled ? '#aaa' : DARK });

  // ─── Verification UI Helpers ───
  const outlineBtn = { width: '100%', height: 52, borderRadius: 14, background: 'transparent', color: '#ccc', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Space Grotesk', sans-serif" };
  const FlashlightIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8.5L10 22v-8H6"/></svg>;

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#fff", position: 'relative', overflow: 'hidden' }}>
      
      {/* ── Map (40dvh) ── */}
      <div style={{ height: "40dvh", position: "relative", zIndex: 0, flexShrink: 0, overflow: 'hidden' }}>
        <LeafletMap bikes={[]} docks={state.docks} userLocation={userLocation} followUser={true} />
        <div style={{ position: "absolute", top: 14, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <button style={{ width: 42, height: 42, borderRadius: 12, background: "white", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }} onClick={() => setShowShare(true)}>
            <Icons.ExternalLinkIcon size={18} color={DARK} />
          </button>
          <div style={{ background: LIME, borderRadius: 50, padding: "7px 16px", display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk',sans-serif", boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <span style={{ width: 7, height: 7, background: DARK, borderRadius: "50%", animation: 'pulse 1.5s infinite' }} />
            Ride Active
          </div>
          <button style={{ width: 42, height: 42, borderRadius: 12, background: "#FF3B30", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(255,59,48,0.4)' }} onClick={handleSOS} title={`Call Help: ${SOS_NUMBER}`}>
            <Icons.PhoneIcon size={18} color="white" />
          </button>
        </div>
      </div>

      {/* ── Stats Card ── */}
      <div style={{ padding: "10px 16px 0", flexShrink: 0 }}>
        <div style={{ background: DARK, borderRadius: 18, padding: "14px 10px", display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", boxShadow: "0 6px 24px rgba(0,0,0,0.12)" }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: "#777", fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Duration</div>
            <div style={{ fontSize: 19, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: LIME, letterSpacing: 1 }}>{fmtTime(displaySeconds)}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)" }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: "#777", fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Cost</div>
            <div style={{ fontSize: 19, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: "white" }}>{displayCost}<span style={{ fontSize: 9, color: '#777', fontWeight: 600, marginLeft: 2 }}>EGP</span></div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)" }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: "#777", fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Distance</div>
            <div style={{ fontSize: 19, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: "white" }}>{fmtDist(displayKm)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6, padding: '4px 10px', background: '#f6f6f6', borderRadius: 8, fontSize: 10, color: '#aaa', fontWeight: 600 }}>💰 0.50 EGP per minute</div>
      </div>

      {/* ── Bike Info ── */}
      <div style={{ padding: "8px 16px 0", flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8f9fa', borderRadius: 12, padding: '10px 12px', border: '1px solid #eee' }}>
          <div style={{ width: 36, height: 36, background: LIME, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icons.BikeIconSVG size={18} color={DARK} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 13, fontFamily: "'Space Grotesk',sans-serif" }}>{state.selectedBike?.id || 'B-LOCAL'}</div>
            <div style={{ color: '#999', fontSize: 11 }}>{state.user?.startDockName || 'Starting Point'}</div>
          </div>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: '#eee', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} onClick={() => setShowShare(true)}>
            <Icons.ExternalLinkIcon size={14} color={DARK} />
          </button>
        </div>
      </div>

      {/* ── End Ride & SOS Buttons ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: "0 24px", gap: 12 }}>
        <button style={{ flex: 1, maxWidth: 160, height: 54, borderRadius: 50, background: '#111', color: 'white', fontWeight: 900, fontSize: 15, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif", transition: 'all 0.2s' }} onClick={handleSOS}>
          <Icons.PhoneIcon size={17} color="white" /> Help / SOS
        </button>
        <button style={{ flex: 1, maxWidth: 200, height: 54, borderRadius: 50, background: checkingZone ? '#999' : '#FF3B30', color: 'white', fontWeight: 900, fontSize: 15, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 6px 24px rgba(255,59,48,0.35)', cursor: checkingZone ? 'not-allowed' : 'pointer', fontFamily: "'Space Grotesk',sans-serif", transition: 'all 0.2s' }} onClick={handleEndRide} disabled={checkingZone}>
          {checkingZone ? (<><div style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Wait...</>) : (<><Icons.LockIcon size={17} color="white" />End Ride</>)}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          VERIFICATION FLOW (Screens 1 to 4)
      ══════════════════════════════════════════════════════════════ */}
      {(endStep?.startsWith('verify_')) && (
        <div style={{ position: 'absolute', inset: 0, background: '#111', zIndex: 500, display: 'flex', flexDirection: 'column', fontFamily: "'Space Grotesk', sans-serif", color: 'white', overflow: 'hidden' }}>
          
          {/* Camera feed base (for camera & warning screens) */}
          {(endStep === 'verify_camera' || endStep === 'verify_warning') && (
            <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: cameraStream ? 1 : 0, transition: 'opacity 0.3s' }} />
          )}

          {/* Top Bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '16px 20px', flexShrink: 0, zIndex: 10 }}>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setEndStep(null)}>
              <Icons.ChevronLeftIcon size={20} color={DARK} />
            </button>
            <div style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, color: (endStep === 'verify_camera' || endStep === 'verify_warning') ? 'rgba(255,255,255,0.9)' : 'white' }}>Verify Bike Lock</div>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlashlightIcon />
            </button>
          </div>

          {/* Frame Brackets Layer (Hidden on warning/success modals if needed, but we keep it back) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 5, paddingBottom: 60 }}>
            <div style={{ width: 280, height: 280, position: 'relative' }}>
              {[
                { top: 0, left: 0, borderTop: '2px solid white', borderLeft: '2px solid white', borderRadius: '24px 0 0 0' },
                { top: 0, right: 0, borderTop: '2px solid white', borderRight: '2px solid white', borderRadius: '0 24px 0 0' },
                { bottom: 0, left: 0, borderBottom: '2px solid white', borderLeft: '2px solid white', borderRadius: '0 0 0 24px' },
                { bottom: 0, right: 0, borderBottom: '2px solid white', borderRight: '2px solid white', borderRadius: '0 0 24px 0' },
              ].map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: 44, height: 44, opacity: 0.8, ...s }} />
              ))}
            </div>
          </div>

          {/* Bottom Actions for Screen 1 & 4 background */}
          {(endStep === 'verify_start' || endStep === 'verify_success') && (
            <div style={{ padding: '0 24px 36px', zIndex: 10, position: 'relative' }}>
              <div style={{ textAlign: 'center', color: '#ccc', fontSize: 13, marginBottom: 18 }}>Take a photo of your locked bike</div>
              <button style={limeBtn(false)} onClick={() => setEndStep('verify_camera')}>
                Take photo
              </button>
              <button style={{ ...outlineBtn, marginTop: 14 }} onClick={handleSOS}>
                <Icons.AlertTriangleIcon size={16} color="#ccc" /> Need Help?
              </button>
            </div>
          )}

          {/* Bottom Action for Screen 2 */}
          {endStep === 'verify_camera' && (
            <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
              <button onClick={takePhotoCheck} style={{ width: 68, height: 68, borderRadius: 20, background: LIME, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(204,255,0,0.3)' }}>
                <Icons.CameraIcon size={30} color={DARK} />
              </button>
            </div>
          )}

          {/* Modals for Screen 3 and 4 */}
          {(endStep === 'verify_warning' || endStep === 'verify_success') && (
            <div style={{ position: 'absolute', inset: 0, background: endStep === 'verify_success' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              {endStep === 'verify_warning' && (
                <div style={{ width: '100%', maxWidth: 320, background: 'white', borderRadius: 20, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: DARK, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', animation: 'popIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f5ffcc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <div style={{ color: DARK, fontSize: 32, fontWeight: 900 }}>!</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>Warning: Your bike is unlocked!</div>
                  <p style={{ color: '#888', fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>Your bike is not secured.<br/>please lock it!</p>
                  <button style={{ width: '100%', height: 48, borderRadius: 12, background: LIME, color: DARK, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif" }} onClick={() => setEndStep('verify_camera')}>
                    Retake photo
                  </button>
                </div>
              )}
              {endStep === 'verify_success' && (
                <div style={{ width: '100%', maxWidth: 320, background: 'white', borderRadius: 24, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: DARK, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
                  <div style={{ width: 84, height: 84, background: '#f5ffcc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    <Icons.CheckIcon size={44} color={DARK} />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Bike Lock Verified</div>
                  <p style={{ color: '#888', fontSize: 14 }}>Your bike is safely locked</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCREEN 1: RIDE SUMMARY (Light Mode)
      ══════════════════════════════════════════════════════════════ */}
      {endStep === 'summary' && (
        <div style={{ ...lightOverlay, padding: '40px 24px 24px', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, background: LIME, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icons.CheckIcon size={44} color={DARK} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: DARK }}>Ride Completed!</div>
            <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>Here's your ride summary</p>
          </div>

          {/* Ride Summary card */}
          <div style={{ fontSize: 16, fontWeight: 800, color: DARK, marginBottom: 12 }}>Ride Summary</div>
          <div style={{ background: '#f6f6f8', borderRadius: 16, padding: '16px', marginBottom: 24 }}>
            {[
              ['Bike', state.selectedBike?.id || 'City Cruiser'],
              ['Duration', fmtTime(finalSeconds ?? elapsedSeconds)],
              ['Distance', fmtDist(finalKm ?? distanceKm)],
              ['Rate', '0.50 EGP/min'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#888', fontSize: 14, fontWeight: 600 }}>{k}</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: DARK }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Total Cost card */}
          <div style={{ background: '#f6f6f8', borderRadius: 16, padding: '20px 16px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: DARK }}>Total Cost</div>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Pending Payment</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: DARK }}>{calcCost(finalSeconds ?? elapsedSeconds)} EGP</div>
          </div>

          {/* Condition checkbox */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px', background: '#f6f6f8', borderRadius: 16, cursor: 'pointer', marginBottom: 32, border: bikeConditionOk ? `2px solid ${DARK}` : '2px solid transparent' }} onClick={() => setBikeConditionOk(!bikeConditionOk)}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${DARK}`, background: bikeConditionOk ? DARK : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              {bikeConditionOk && <Icons.CheckIcon size={14} color="white" />}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: DARK, marginBottom: 2 }}>The bike is in good condition</div>
              <div style={{ fontSize: 11, color: '#888', lineHeight: 1.4 }}>Please confirm that the bike has no damage and is properly parked.</div>
            </div>
          </label>

          <div style={{ marginTop: 'auto' }}>
            <button style={limeBtn(!bikeConditionOk)} onClick={handleProceedPayment} disabled={!bikeConditionOk}>
              Proceed To Payment
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCREEN 2: PAYMENT OVERVIEW (Light Mode)
      ══════════════════════════════════════════════════════════════ */}
      {endStep === 'payment_overview' && (
        <div style={{ ...lightOverlay, padding: '16px 24px 24px', overflowY: 'auto' }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <button style={{ width: 32, height: 32, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setEndStep('summary')}>
              <Icons.ChevronLeftIcon size={24} color={DARK} />
            </button>
            <div style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 800, color: DARK, marginRight: 32 }}>Payment</div>
          </div>

          {/* Rental Summary card */}
          <div style={{ fontSize: 13, fontWeight: 800, color: DARK, marginBottom: 10 }}>Rental Summary</div>
          <div style={{ background: '#f6f6f8', borderRadius: 16, padding: '16px', marginBottom: 24 }}>
            {[
              ['Bike', state.selectedBike?.id || 'City Cruiser'],
              ['Duration', fmtTime(finalSeconds ?? elapsedSeconds)],
              ['Rate', '0.50 EGP/min'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#888', fontSize: 14, fontWeight: 600 }}>{k}</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: DARK }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: '2px solid rgba(0,0,0,0.05)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: DARK, fontSize: 16, fontWeight: 800 }}>Total</span>
              <span style={{ fontWeight: 900, fontSize: 16, color: DARK }}>{displayCost} EGP</span>
            </div>
          </div>

          {/* Payment Method Section */}
          <div style={{ fontSize: 13, fontWeight: 800, color: DARK, marginBottom: 10 }}>Payment Method</div>
          <div style={{ background: '#f6f6f8', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, background: '#ce1126', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.PhoneIcon size={20} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: DARK }}>Vodafone Cash</div>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Mobile Wallet</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: `6px solid ${DARK}`, background: '#fff' }} />
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button style={limeBtn(false)} onClick={() => setEndStep('payment_method')}>
              Continue To Payment
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCREEN 3: VODAFONE CASH INPUT (Light Mode)
      ══════════════════════════════════════════════════════════════ */}
      {endStep === 'payment_method' && (
        <div style={{ ...lightOverlay, padding: '16px 24px 24px', overflowY: 'auto' }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <button style={{ width: 32, height: 32, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setEndStep('payment_overview')}>
              <Icons.ChevronLeftIcon size={24} color={DARK} />
            </button>
            <div style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 800, color: DARK, marginRight: 32 }}>Payment Method</div>
          </div>

          <div style={{ fontSize: 15, fontWeight: 800, color: DARK, marginBottom: 16 }}>Vodafone Cash Wallet</div>
          
          <div style={{ background: '#f6f6f8', borderRadius: 16, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, background: '#ce1126', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.PhoneIcon size={24} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: DARK }}>Enter Wallet Number</div>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Amount to pay: <span style={{ color: '#ce1126' }}>{displayCost} EGP</span></div>
              </div>
            </div>

            <input
              type="tel" inputMode="numeric" maxLength={11}
              placeholder="01XXXXXXXXX"
              value={walletNumber}
              onChange={e => setWalletNumber(e.target.value.replace(/\D/g, ''))}
              style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: 12, border: '2px solid #ddd', background: '#fff', color: DARK, fontSize: 18, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", outline: 'none', letterSpacing: 2, textAlign: 'center' }}
              onFocus={e => e.target.style.borderColor = '#ce1126'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button style={limeBtn(paying)} onClick={handlePay} disabled={paying}>
              {paying ? (<><div style={{ width: 16, height: 16, border: '2.5px solid rgba(0,0,0,0.3)', borderTopColor: DARK, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Processing...</>) : (<>Pay Now</>)}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCREEN 4: CONFIRM PAYMENT / RECEIPT (Light Mode)
      ══════════════════════════════════════════════════════════════ */}
      {endStep === 'receipt' && (
        <div style={{ ...lightOverlay, padding: '16px 24px 24px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 800, color: DARK, marginBottom: 40, marginTop: 4 }}>Confirm Payment</div>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
              <Icons.CheckIcon size={40} color="white" />
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: DARK }}>Payment Successful!</div>
            <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>Thank you for your ride</p>
          </div>

          <div style={{ background: '#f6f6f8', borderRadius: 16, padding: '20px 16px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: DARK }}>Receipt</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#888' }}>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            
            {[
              ['Transaction ID', txnId],
              ['Duration', fmtTime(finalSeconds ?? elapsedSeconds)],
              ['Distance', fmtDist(finalKm ?? distanceKm)],
              ['Rate', '0.50 EGP/min'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#888', fontSize: 13, fontWeight: 600 }}>{k}</span>
                <span style={{ fontWeight: 800, fontSize: 13, color: DARK }}>{v}</span>
              </div>
            ))}
            
            <div style={{ borderTop: '2px solid rgba(0,0,0,0.05)', margin: '14px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: '#888', fontSize: 14, fontWeight: 600 }}>Total paid</span>
              <span style={{ fontWeight: 900, fontSize: 15, color: DARK }}>{displayCost} EGP</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: '#888', fontSize: 14, fontWeight: 600 }}>Payment Method</span>
              <span style={{ fontWeight: 800, fontSize: 14, color: DARK }}>Vodafone Cash</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button style={limeBtn(false)} onClick={handleBackHome}>
              Back To Home
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SHARE MODAL
      ══════════════════════════════════════════════════════════════ */}
      {showShare && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="sheet-handle" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div className="page-title" style={{ fontSize: 19 }}>Share Your Ride</div>
              <button style={{ background: "none", border: "none", cursor: "pointer", display: 'flex' }} onClick={() => setShowShare(false)}>
                <Icons.XIcon size={20} color="#888" />
              </button>
            </div>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 14 }}>Share your live location with friends or family.</p>
            <div style={{ background: "#f5fde0", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Icons.ShieldCheckIcon size={16} color="#2e7d32" />
              <span style={{ fontSize: 12, color: "#666" }}>You control who sees your location.</span>
            </div>
            <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>SHARE VIA</div>
            <div className="share-apps">
              {[
                { name: "WhatsApp", icon: <Icons.MessageSquareIcon size={20} color="white" />, bg: "#25D366" },
                { name: "Messages", icon: <Icons.MessageSquareIcon size={20} color="white" />, bg: "#34aadc" },
                { name: "Messenger", icon: <Icons.MessageSquareIcon size={20} color="white" />, bg: "#a259ff" },
                { name: "More", icon: <Icons.MoreHorizontalIcon size={20} color={DARK} />, bg: "#e0e0e0" }
              ].map((app) => (
                <div key={app.name} className="share-app" onClick={() => setShowShare(false)}>
                  <div className="share-app-icon" style={{ background: app.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{app.icon}</div>
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
                <div style={{ width: 44, height: 44, background: "#f0f0f0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{opt.icon}</div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
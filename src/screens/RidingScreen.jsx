import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import LeafletMap from '../features/telemetry/LeafletMap';
import localforage from 'localforage';
import { simulateDockLock, calculateDistance } from '../features/telemetry/SensorGate.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

const FINE_RATE_PER_MIN = 1.0;
const SOS_NUMBER = "+201022094608";
const DK = '#1a1a2e';  // dark bg
const DK2 = '#16213e'; // darker card
const ACC = '#e94560';  // accent red

const fmtTime = (secs) => {
  const absSecs = Math.abs(secs);
  const h = Math.floor(absSecs / 3600);
  const m = Math.floor((absSecs % 3600) / 60);
  const s = absSecs % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
};

const fmtDist = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(2)} km`;
const genTxId = () => 'TXN-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

// ─── Component ────────────────────────────────────────────────────────────────
export default function RidingScreen({ navigate, state, setState }) {
  // ── Ride tracking ──
  const activeRide = state.user?.activeRide || {};
  const reservedSecs = activeRide.reservedDurationSecs || 0;
  const initialPaid = activeRide.paidAmount || 0;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [toast, setToast] = useState(null); // { message: string, visible: boolean }
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

  const [columnIdInput, setColumnIdInput] = useState('');
  const [verifyingColumn, setVerifyingColumn] = useState(false);

  // ── Access guard ──
  useEffect(() => {
    if (state.user?.status && state.user.status !== 'verified') {
      navigate('statusDashboard');
    }
  }, [state.user?.status, navigate]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ── Main ride tick ──
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!rideActive.current) return;
      setElapsedSeconds(p => {
        const next = p + 1;
        // Notify every 5 mins (300s)
        if (next > 0 && next % 300 === 0 && next < reservedSecs) {
          const remainingMins = Math.ceil((reservedSecs - next) / 60);
          setToast({ message: `Remaining time: ${remainingMins} minutes` });
        }
        return next;
      });

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
          () => { },
          { enableHighAccuracy: true, maximumAge: 2000 }
        );
      }
    }, 1000);
    return () => { clearInterval(timerRef.current); rideActive.current = false; };
  }, [setState, reservedSecs]);

  const displaySeconds = finalSeconds ?? elapsedSeconds;
  const displayKm = finalKm ?? distanceKm;

  // Pricing Logic
  const timeLeft = reservedSecs - displaySeconds;
  const isOvertime = timeLeft < 0;
  const overtimeSecs = isOvertime ? Math.abs(timeLeft) : 0;
  const fine = Math.floor(overtimeSecs / 60) * FINE_RATE_PER_MIN;
  const displayCost = (initialPaid + fine).toFixed(2);

  // ═══════════════════════════════════════════════════════
  // END-RIDE HANDLERS
  // ═══════════════════════════════════════════════════════

  function handleEndRide() {
    setEndStep('enter_column_id');
  }

  async function submitColumnId(enteredId) {
    if (!enteredId || enteredId.trim() === '') {
      setToast({ message: "Please enter a valid Column ID." });
      return;
    }

    setVerifyingColumn(true);
    const dockId = enteredId.toUpperCase().trim();

    try {
      const dockRef = doc(db, "docks", dockId);
      const dockSnap = await getDoc(dockRef);

      if (!dockSnap.exists()) {
        setToast({ message: "Invalid Column ID. Please check the LCD." });
        setVerifyingColumn(false);
        return;
      }

      const dockData = dockSnap.data();
      const bikeId = state.selectedBike?.id || 'B-LOCAL';

      if (dockData.occupiedBy && dockData.occupiedBy !== bikeId) {
        setToast({ message: "This column is occupied by another bike." });
        setVerifyingColumn(false);
        return;
      }

      // Freeze values
      setFinalSeconds(elapsedSeconds);
      setFinalKm(distanceKm);
      rideActive.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setEndStep('verifying_lock');

      // Simulate physical lock
      await simulateDockLock(dockId);

      // Update Firestore: Dock status
      await updateDoc(dockRef, {
        occupiedBy: bikeId,
        servoPos: 170
      });

      // Update Firestore: Bike status and coords
      const bikeRef = doc(db, "bikes", bikeId);
      await updateDoc(bikeRef, {
        locked: true,
        lat: dockData.lat || 31.4398,
        lng: dockData.lng || 31.6705
      });

      // Release any other docks previously occupied by this bike (clean-up)
      const otherDocks = state.docks?.filter(d => d.occupiedBy === bikeId && d.id !== dockId) || [];
      for (const od of otherDocks) {
        await updateDoc(doc(db, "docks", od.id), { occupiedBy: null, servoPos: 10 });
      }

      // Update local React state to reflect database changes
      setState(s => ({
        ...s,
        docks: (s.docks || []).map(d =>
          d.id === dockId
            ? { ...d, occupiedBy: bikeId, servoPos: 170 }
            : (d.occupiedBy === bikeId ? { ...d, occupiedBy: null, servoPos: 10 } : d)
        ),
        bikes: (s.bikes || []).map(b => b.id === bikeId ? { ...b, locked: true, lat: dockData.lat, lng: dockData.lng } : b)
      }));

      setEndStep('verify_start');
    } catch (err) {
      console.error("Error verifying Column ID or locking:", err);
      setToast({ message: "Verification failed. Try again." });
    } finally {
      setVerifyingColumn(false);
    }
  }

  function takePhotoCheck() {
    setEndStep('verify_ai');

    setTimeout(async () => {
      try {
        const logs = await localforage.getItem('admin_logs') || [];
        logs.unshift({
          timestamp: new Date().toISOString(),
          operator: state.user?.name || state.user?.phone || 'AI Vision',
          action: 'AI_PHOTO_VERIFICATION',
          details: `Verified bike ${state.selectedBike?.id || 'B-LOCAL'} is locked properly.`,
          isSystem: true
        });
        await localforage.setItem('admin_logs', logs);
      } catch (e) {
        console.error("AI log save error", e);
      }

      if (photoFailCount === 0) {
        setEndStep('verify_warning');
        setPhotoFailCount(1);
      } else {
        setEndStep('verify_success');
        setTimeout(() => setEndStep('summary'), 2000);
      }
    }, 2000);
  }

  function handleProceedPayment() {
    if (!bikeConditionOk) return;
    const emptyDock = state.docks?.find(d => d.occupiedBy === (state.selectedBike?.id || 'B-LOCAL')) || state.docks?.[0];
    const newTrip = {
      id: Date.now(), date: new Date().toISOString(), cost: displayCost,
      duration: fmtTime(finalSeconds ?? elapsedSeconds),
      distanceKm: (finalKm ?? distanceKm).toFixed(2),
      from: state.user?.startDockName || 'Start',
      to: emptyDock?.name || 'End', status: 'Completed'
    };

    if (fine > 0) {
      setState(s => ({
        ...s,
        user: {
          ...s.user, activeRide: null, startDockName: null,
          rideHistory: [newTrip, ...(s.user.rideHistory || [])],
          currentRide: { elapsedSeconds: finalSeconds ?? elapsedSeconds, cost: displayCost, date: new Date().toISOString() }
        }
      }));
      setEndStep('payment_overview');
    } else {
      // No fine: End ride completely and return to map
      setState(s => ({
        ...s,
        bikes: (s.bikes || []).map(b => b.id === (s.selectedBike?.id || 'B-LOCAL') ? { ...b, status: 'available', locked: true, riderPhone: null } : b),
        selectedBike: null,
        user: {
          ...s.user, activeRide: null, startDockName: null,
          rideHistory: [newTrip, ...(s.user.rideHistory || [])],
          currentRide: { elapsedSeconds: finalSeconds ?? elapsedSeconds, cost: displayCost, date: new Date().toISOString() }
        }
      }));
      navigate('map');
    }
  }

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

  function handleBackHome() {
    navigate('map');
  }

  async function handleSOS() {
    const lat = prevLocRef.current?.lat || 0;
    const lng = prevLocRef.current?.lng || 0;
    try {
      const logs = await localforage.getItem('admin_logs') || [];
      logs.unshift({ timestamp: new Date().toISOString(), operator: state.user?.name || state.user?.phone || 'Unknown', action: 'EMERGENCY SOS TRIGGERED', details: `Coordinates: [${lat}, ${lng}]`, isSystem: true });
      await localforage.setItem('admin_logs', logs);
    } catch (e) { }
    window.location.href = `tel:${SOS_NUMBER}`;
  }

  const handleShare = async (platform) => {
    const text = `Track my live Smart Bike ride! I'm on bike ${state.selectedBike?.id || 'B-LOCAL'}. \nDistance covered: ${fmtDist(displayKm)}`;
    const url = "https://smart-bike.vercel.app/track/testing";

    if (platform === 'Copy Link') {
      navigator.clipboard.writeText(url);
      setToast({ message: "Link copied to clipboard!" });
      setTimeout(() => setToast(null), 3000);
      setShowShare(false);
      return;
    }

    if (platform === 'WhatsApp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
      setShowShare(false);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Smart Bike Ride',
          text: text,
          url: url
        });
      } catch (err) { }
    } else {
      setToast({ message: `Share via ${platform} not supported on this device.` });
      setTimeout(() => setToast(null), 3000);
    }
    setShowShare(false);
  };

  // ─── Shared Styles ───
  const lightOverlay = { position: 'absolute', inset: 0, background: '#fff', zIndex: 500, display: 'flex', flexDirection: 'column', fontFamily: "'Space Grotesk', sans-serif" };
  const accentBtn = (disabled) => ({ width: '100%', height: 52, borderRadius: 14, background: disabled ? '#f0f0f0' : ACC, color: disabled ? '#aaa' : 'white', border: 'none', fontWeight: 800, fontSize: 15, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Space Grotesk', sans-serif", transition: 'all 0.2s' });
  const limeBtn = (disabled) => ({ ...accentBtn(disabled), background: disabled ? '#f0f0f0' : LIME, color: disabled ? '#aaa' : DARK });
  const outlineBtn = { width: '100%', height: 52, borderRadius: 14, background: 'transparent', color: '#ccc', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Space Grotesk', sans-serif" };
  const FlashlightIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8.5L10 22v-8H6" /></svg>;

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: isOvertime ? '#fff1f1' : "#fff", position: 'relative', overflow: 'hidden', transition: 'background 0.5s' }}>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)',
          background: DARK, color: 'white', padding: '12px 20px', borderRadius: 12,
          zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'slideDown 0.4s ease-out', fontWeight: 600, fontSize: 13
        }}>
          <Icons.BellIcon size={18} color={LIME} />
          {toast.message}
        </div>
      )}

      {/* Buzzer Alert Header */}
      {isOvertime && (
        <div style={{
          background: '#FF3B30', color: 'white', padding: '8px 16px', textAlign: 'center',
          fontWeight: 900, fontSize: 14, fontFamily: "'Space Grotesk',sans-serif",
          animation: 'pulseRed 1s infinite', zIndex: 100
        }}>
          ⚠️ OVERTIME: {fmtTime(overtimeSecs)} (Fine Active)
        </div>
      )}

      {/* ── 1. Map (Full Screen) ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <LeafletMap bikes={[]} docks={state.docks} userLocation={userLocation} followUser={true} />
      </div>

      {/* ── 2. Top UI Layer (Floating) ── */}
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, zIndex: 10, display: "flex", flexDirection: "column", gap: 16, pointerEvents: 'none' }}>

        {/* Navigation / Status Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", pointerEvents: 'auto' }}>
          <button style={{ width: 44, height: 44, borderRadius: 12, background: "white", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} onClick={() => setShowShare(true)}>
            <Icons.MenuIcon size={22} color={DARK} />
          </button>
          <div style={{ background: isOvertime ? '#FF3B30' : LIME, color: isOvertime ? 'white' : DARK, borderRadius: 12, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 13, fontFamily: "'Space Grotesk',sans-serif", boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
            <span style={{ width: 8, height: 8, background: isOvertime ? 'white' : DARK, borderRadius: "50%", animation: 'pulse 1.5s infinite' }} />
            {isOvertime ? 'Overtime Active' : 'Ride in Progress'}
          </div>
          <div style={{ width: 44 }}></div> {/* spacer */}
        </div>

        {/* Floating Stats Card */}
        <div style={{ background: "white", borderRadius: 24, padding: "24px 20px", boxShadow: "0 10px 40px rgba(0,0,0,0.12)", pointerEvents: 'auto' }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 50, background: isOvertime ? '#ffebeb' : '#f4f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.ClockIcon size={18} color={isOvertime ? '#FF3B30' : DARK} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#888", fontWeight: 700 }}>{isOvertime ? 'Extra Time' : 'Time Left'}</div>
                <div style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: isOvertime ? '#FF3B30' : DARK }}>
                  {isOvertime ? `+${fmtTime(overtimeSecs)}` : fmtTime(timeLeft)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 50, background: '#eaf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.LocationIcon size={18} color="#007AFF" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#888", fontWeight: 700 }}>Distance</div>
                <div style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: DARK }}>
                  {fmtDist(displayKm)}
                </div>
              </div>
            </div>

          </div>

          {/* Progress Line */}
          <div style={{ marginTop: 24, padding: '0 4px' }}>
            <div style={{ height: 4, background: '#f0f0f0', borderRadius: 4, width: '100%', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(100, Math.max(0, 100 - (timeLeft / (30 * 60000)) * 100))}%`, background: DARK, borderRadius: 4, transition: 'width 1s linear' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Bottom UI Overlays (Floating Icons + Bottom Controls) ── */}
      <div style={{ position: "absolute", bottom: 180, left: 16, right: 16, display: "flex", justifyContent: "space-between", zIndex: 10, pointerEvents: 'none' }}>
        <button style={{ width: 44, height: 44, borderRadius: 50, background: LIME, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', pointerEvents: 'auto' }} onClick={() => setShowShare(true)}>
          <Icons.ShareIcon size={18} color={DARK} />
        </button>
        <button style={{ width: 44, height: 44, borderRadius: 50, background: LIME, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', pointerEvents: 'auto' }} onClick={handleSOS}>
          <Icons.AlertTriangleIcon size={18} color={DARK} />
        </button>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "white", borderRadius: "32px 32px 0 0", padding: "24px 24px 32px", display: "flex", flexDirection: "column", gap: 14, zIndex: 10, boxShadow: "0 -10px 40px rgba(0,0,0,0.08)" }}>
        <button
          style={{ width: '100%', height: 56, borderRadius: 14, background: checkingZone ? '#999' : '#e60000', color: 'white', fontWeight: 800, fontSize: 16, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: checkingZone ? 'not-allowed' : 'pointer', fontFamily: "'Space Grotesk',sans-serif", transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(230,0,0,0.3)' }}
          onClick={handleEndRide}
          disabled={checkingZone}
        >
          {checkingZone ? (<><div style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Wait...</>) : "End Ride"}
        </button>

        <button
          style={{ width: '100%', height: 56, borderRadius: 14, background: "white", color: DARK, fontWeight: 800, fontSize: 16, border: '2px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif", transition: 'all 0.2s' }}
        >
          <Icons.LockIcon size={18} color={DARK} /> Pause & Lock
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          COLUMN ID LOCK FLOW
      ══════════════════════════════════════════════════════════════ */}
      {endStep === 'enter_column_id' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,17,30,0.95)', backdropFilter: 'blur(10px)', zIndex: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
          <div style={{ width: '100%', maxWidth: 360, background: 'white', borderRadius: 24, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: DARK, boxShadow: '0 20px 50px rgba(0,0,0,0.4)', animation: 'slideUpMap 0.35s ease-out' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f5ffcc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Icons.LockIcon size={28} color={DARK} />
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8, textAlign: 'center' }}>
              Lock Bike
            </h2>
            <p style={{ color: '#666', fontSize: 13, textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
              Enter the Column ID displayed on the LCD screen of the dock you are locking the bike at.
            </p>

            <input
              type="text"
              placeholder="e.g. Station_XXX"
              value={columnIdInput}
              onChange={e => setColumnIdInput(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '16px',
                borderRadius: 14,
                border: '2px solid #ddd',
                background: '#f9f9fb',
                color: DARK,
                fontSize: 16,
                fontWeight: 800,
                textAlign: 'center',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 20,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />

            <button
              style={{ ...limeBtn(verifyingColumn), height: 50, marginBottom: 12 }}
              onClick={() => submitColumnId(columnIdInput)}
              disabled={verifyingColumn || !columnIdInput}
            >
              {verifyingColumn ? 'Verifying...' : 'Verify & Lock'}
            </button>

            <button
              style={{ ...outlineBtn, color: '#666', borderColor: '#ddd', height: 50 }}
              onClick={() => {
                setEndStep(null);
                setColumnIdInput('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {endStep === 'verifying_lock' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,17,30,0.95)', backdropFilter: 'blur(10px)', zIndex: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
          <div className="spinner" style={{ marginBottom: 20, width: 48, height: 48, border: '4px solid rgba(204,255,0,0.3)', borderTopColor: LIME }} />
          <div style={{ color: "white", fontSize: 18, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>
            Securing Lock...
          </div>
          <p style={{ color: '#ccc', fontSize: 14, textAlign: 'center' }}>
            Communicating with Column device to secure the physical lock.
            <br />
            جاري الاتصال بجهاز العمود لتأمين قفل الدراجة.
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VERIFICATION FLOW (Screens 1 to 4)
          ══════════════════════════════════════════════════════════════ */}
      {(endStep?.startsWith('verify_')) && (
        <div style={{ position: 'absolute', inset: 0, background: '#111', zIndex: 500, display: 'flex', flexDirection: 'column', fontFamily: "'Space Grotesk', sans-serif", color: 'white', overflow: 'hidden' }}>

          {/* Camera feed base */}
          {(endStep === 'verify_camera' || endStep === 'verify_warning') && (
            <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: cameraStream ? 1 : 0, transition: 'opacity 0.3s' }} />
          )}

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '16px 20px', flexShrink: 0, zIndex: 10 }}>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setEndStep(null)}>
              <Icons.ChevronLeftIcon size={20} color={DARK} />
            </button>
            <div style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, color: (endStep === 'verify_camera' || endStep === 'verify_warning') ? 'rgba(255,255,255,0.9)' : 'white' }}>Verify Bike Lock</div>
          </div>

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

          {(endStep === 'verify_start' || endStep === 'verify_success') && (
            <div style={{ padding: '0 24px 36px', zIndex: 10, position: 'relative' }}>
              <div style={{ textAlign: 'center', color: '#ccc', fontSize: 13, marginBottom: 18 }}>Take a photo of your locked bike</div>
              <button style={limeBtn(false)} onClick={() => setEndStep('verify_camera')}>
                Take photo
              </button>
            </div>
          )}

          {endStep === 'verify_camera' && (
            <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
              <button onClick={takePhotoCheck} style={{ width: 68, height: 68, borderRadius: 20, background: LIME, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(204,255,0,0.3)' }}>
                <Icons.CameraIcon size={30} color={DARK} />
              </button>
            </div>
          )}

          {endStep === 'verify_ai' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <div className="spinner" style={{ marginBottom: 20, width: 48, height: 48, border: '4px solid rgba(204,255,0,0.3)', borderTopColor: LIME }} />
              <div style={{ color: "white", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>AI Vision Engine</div>
              <p style={{ color: '#ccc', fontSize: 14, textAlign: 'center' }}>Analyzing lock position and bike condition...</p>
            </div>
          )}

          {(endStep === 'verify_warning' || endStep === 'verify_success') && (
            <div style={{ position: 'absolute', inset: 0, background: endStep === 'verify_success' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              {endStep === 'verify_warning' && (
                <div style={{ width: '100%', maxWidth: 320, background: 'white', borderRadius: 20, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: DARK, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f5ffcc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <div style={{ color: DARK, fontSize: 32, fontWeight: 900 }}>!</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>Warning: Your bike is unlocked!</div>
                  <p style={{ color: '#888', fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>Your bike is not secured.<br />please lock it!</p>
                  <button style={{ width: '100%', height: 48, borderRadius: 12, background: LIME, color: DARK, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif" }} onClick={() => setEndStep('verify_camera')}>
                    Retake photo
                  </button>
                </div>
              )}
              {endStep === 'verify_success' && (
                <div style={{ width: '100%', maxWidth: 320, background: 'white', borderRadius: 24, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: DARK, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
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

      {/* ── SUMMARY & PAYMENT SCREENS ── */}
      {endStep === 'summary' && (
        <div style={{ ...lightOverlay, padding: '40px 24px 24px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, background: LIME, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icons.CheckIcon size={44} color={DARK} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: DARK }}>Ride Completed!</div>
          </div>

          <div style={{ background: '#f6f6f8', borderRadius: 16, padding: '16px', marginBottom: 24 }}>
            {[
              ['Bike', state.selectedBike?.id || 'City Cruiser'],
              ['Total Time', fmtTime(displaySeconds)],
              ['Reserved Time', fmtTime(reservedSecs)],
              ['Overtime', isOvertime ? fmtTime(overtimeSecs) : '00:00:00'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#888', fontSize: 14, fontWeight: 600 }}>{k}</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: DARK }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#f6f6f8', borderRadius: 16, padding: '20px 16px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: DARK }}>{fine > 0 ? 'Balance to Pay' : 'Total Cost'}</div>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{fine > 0 ? 'Including Overtime Fine' : 'Fully Pre-paid'}</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: DARK }}>{fine > 0 ? fine.toFixed(2) : '0.00'} EGP</div>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px', background: '#f6f6f8', borderRadius: 16, cursor: 'pointer', marginBottom: 32, border: bikeConditionOk ? `2px solid ${DARK}` : '2px solid transparent' }} onClick={() => setBikeConditionOk(!bikeConditionOk)}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${DARK}`, background: bikeConditionOk ? DARK : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              {bikeConditionOk && <Icons.CheckIcon size={14} color="white" />}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: DARK }}>Bike condition is good</div>
          </label>

          <button style={limeBtn(!bikeConditionOk)} onClick={handleProceedPayment} disabled={!bikeConditionOk}>
            {fine > 0 ? 'Pay Fine & Complete' : 'Complete Ride'}
          </button>
        </div>
      )}

      {/* Final balance payment Overview */}
      {endStep === 'payment_overview' && (
        <div style={{ ...lightOverlay, padding: '16px 24px 24px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: DARK, textAlign: 'center', marginBottom: 24 }}>Final Payment</div>
          <div style={{ background: '#f6f6f8', borderRadius: 16, padding: '16px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#888' }}>Overtime Fine</span>
              <span style={{ fontWeight: 800 }}>{fine.toFixed(2)} EGP</span>
            </div>
            <div style={{ borderTop: '2px solid rgba(0,0,0,0.05)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ fontSize: 16, fontWeight: 800 }}>Total Balance</span>
              <span style={{ fontWeight: 900, fontSize: 16 }}>{fine.toFixed(2)} EGP</span>
            </div>
          </div>
          <button style={limeBtn(false)} onClick={() => setEndStep('payment_method')}>Proceed to Wallet</button>
        </div>
      )}

      {/* Payment method input (Vodafone Cash) */}
      {endStep === 'payment_method' && (
        <div style={{ ...lightOverlay, padding: '16px 24px 24px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: DARK, textAlign: 'center', marginBottom: 24 }}>Vodafone Cash</div>
          <input
            type="tel" inputMode="numeric" maxLength={11}
            placeholder="01XXXXXXXXX"
            value={walletNumber}
            onChange={e => setWalletNumber(e.target.value.replace(/\D/g, ''))}
            style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: 12, border: '2px solid #ddd', background: '#fff', color: DARK, fontSize: 18, fontWeight: 800, textAlign: 'center' }}
          />
          <button style={{ ...limeBtn(paying), marginTop: 24 }} onClick={handlePay} disabled={paying}>
            {paying ? "Processing..." : `Pay ${fine.toFixed(2)} EGP`}
          </button>
        </div>
      )}

      {/* Final Receipt */}
      {endStep === 'receipt' && (
        <div style={{ ...lightOverlay, padding: '16px 24px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Icons.CheckIcon size={64} color={LIME} />
            <div style={{ fontSize: 22, fontWeight: 900 }}>Ride Summary</div>
          </div>
          <div style={{ background: '#f6f6f8', borderRadius: 16, padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}><span>Total Paid</span><span style={{ fontWeight: 800 }}>{displayCost} EGP</span></div>
          </div>
          <button style={{ ...limeBtn(false), marginTop: 'auto' }} onClick={handleBackHome}>Back to Home</button>
        </div>
      )}

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
                <div key={app.name} className="share-app" onClick={() => handleShare(app.name)}>
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
              <div key={opt.label} className="share-option" onClick={() => handleShare(opt.label)}>
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
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import App from "./SmartBikeApp.jsx";
import AdminApp from "./admin/AdminApp.jsx";
import { DAMIETTA_BIKES } from './features/telemetry/geofence';
import localforage from 'localforage';
import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot, collection, setDoc, getDocs } from 'firebase/firestore';
import { DAMIETTA_BIKES } from './features/telemetry/geofence';

export default function AppRoot() {
  const location = useLocation();
  const [booting, setBooting] = useState(true);
  const [state, setState] = useState({
    selectedBike: null,
    otpMethod: "sms",
    user: { name: "", email: "", profilePic: "", role: "", phone: "", first: "", last: "", status: null, rideHistory: [], startDockName: null },
    bikes: [],
    docks: [],
    users: [],
    isAdminMode: false
  });

  const DEFAULT_DOCKS = [
    { id: "DOCK-DU-01", name: "Damietta University", lat: 31.4398, lng: 31.6705, occupiedBy: "B-LOCAL", servoPos: 170, voltage: 4.2, capacity: 10, lcdMessage: "Welcome!" },
    { id: "DOCK-CP-02", name: "Central Park Hub", lat: 31.4285, lng: 31.6750, occupiedBy: null, servoPos: 170, voltage: 4.2, capacity: 10, lcdMessage: "Ready to ride" },
    { id: "DOCK-BA-03", name: "New Damietta Beach", lat: 31.4550, lng: 31.6620, occupiedBy: null, servoPos: 170, voltage: 3.1, capacity: 10, lcdMessage: "Solar charging..." }
  ];

  const [screen, setScreen] = useState('splash');

  // BOOTING & INITIALIZATION: Run exactly once on mount
  useEffect(() => {
    async function seedInitialData() {
      try {
        const bikesSnap = await getDocs(collection(db, "bikes"));
        if (bikesSnap.empty) {
          console.log("Seeding initial bikes to Firestore...");
          for (const b of DAMIETTA_BIKES) {
            await setDoc(doc(db, "bikes", b.id), { ...b, locked: b.status === 'Locked', voltage: 4.2 });
          }
        }
        
        const docksSnap = await getDocs(collection(db, "docks"));
        if (docksSnap.empty) {
          console.log("Seeding initial docks to Firestore...");
          for (const d of DEFAULT_DOCKS) {
            await setDoc(doc(db, "docks", d.id), d);
          }
        }
      } catch (err) {
        console.error("Seeding failed:", err);
      }
    }

    async function boot() {
      console.log("=== APPROOT BOOTING STARTING (FIREBASE) ===");
      await seedInitialData();
      
      onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          console.log("Firebase Auth detected user:", fbUser.uid);
          const userDoc = await getDoc(doc(db, "users", fbUser.uid));
          let userData = userDoc.exists() ? userDoc.data() : { uid: fbUser.uid, email: fbUser.email, status: 'pending' };

          const path = window.location.pathname;
          const isAdminPath = path.startsWith('/admin');
          const isAdminMode = localStorage.getItem('admin_mode') === 'true';
          let initialScreen = 'map';

          const status = (userData.status || "").toUpperCase();
          if (isAdminMode || isAdminPath) initialScreen = 'adminDashboard';
          else if (status === 'VERIFIED') initialScreen = userData.phoneVerified ? 'map' : 'otp';
          else if (status === 'PENDING') initialScreen = 'pendingApproval';
          else if (status === 'NEED_CORRECTION' || status === 'NEEDS_CORRECTION') initialScreen = 'needCorrection';
          else if (status === 'REJECTED') initialScreen = 'login';
          else initialScreen = 'scanId';

          setState(s => ({ ...s, user: userData, isAdminMode: isAdminMode || isAdminPath }));
          setScreen(initialScreen);
          setBooting(false);
        } else {
          console.log("No Firebase user found - showing splash/login");
          setScreen(window.location.pathname === '/' ? 'splash' : 'login');
          setBooting(false);
        }
      });
    }
    boot();
  }, []);

  // Sync Bikes & Docks from Firestore
  useEffect(() => {
    const unsubBikes = onSnapshot(collection(db, "bikes"), (snap) => {
      const bikesArr = snap.docs.map(d => d.data());
      setState(s => ({ ...s, bikes: bikesArr }));
    });
    const unsubDocks = onSnapshot(collection(db, "docks"), (snap) => {
      const docksArr = snap.docs.map(d => d.data());
      setState(s => ({ ...s, docks: docksArr }));
    });
    
    // Also sync all users if in admin mode
    let unsubUsers = () => {};
    if (state.isAdminMode) {
      unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
        const usersArr = snap.docs.map(d => d.data());
        setState(s => ({ ...s, users: usersArr }));
      });
    }

    return () => { unsubBikes(); unsubDocks(); unsubUsers(); };
  }, [state.isAdminMode]);

  // Real-time Status Sync via Firestore onSnapshot
  useEffect(() => {
    if (booting || state.isAdminMode || !state.user?.uid) return;

    console.log("Setting up real-time status sync for UID:", state.user.uid);
    const unsubscribe = onSnapshot(doc(db, "users", state.user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const liveUser = docSnap.data();
        if (liveUser.status !== state.user.status) {
          console.log("STATUS CHANGE DETECTED (Firestore):", state.user.status, "->", liveUser.status);
          const updatedUser = { ...state.user, ...liveUser };
          setState(s => ({ ...s, user: updatedUser }));
          localStorage.setItem('bike_app_user', JSON.stringify(updatedUser));
          
          if (liveUser.status === 'verified' && !state.isAdminMode) {
            setScreen('map');
          } else if (liveUser.status === 'needs_correction' && !state.isAdminMode) {
             setScreen('statusDashboard');
          }
        }
      }
    });

    return () => unsubscribe();
  }, [state.user?.uid, booting, state.isAdminMode]);

  // Persist user state to localStorage
  useEffect(() => {
    if (!booting && state.user && state.user.phone) {
      localStorage.setItem('bike_app_user', JSON.stringify(state.user));
    }
  }, [state.user, booting]);

  // Handle loading state: Spinner
  if (booting) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp state={state} setState={setState} navigate={setScreen} />} />
      <Route path="/*" element={<App state={state} setState={setState} screen={screen} setScreen={setScreen} />} />
    </Routes>
  );
}

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import App from "./SmartBikeApp.jsx";
import AdminApp from "./admin/AdminApp.jsx";
import { DAMIETTA_BIKES } from './features/telemetry/geofence';
import localforage from 'localforage';

export default function AppRoot() {
  const location = useLocation();
  const [booting, setBooting] = useState(true);
  const [state, setState] = useState({
    selectedBike: null,
    otpMethod: "sms",
    user: { name: "", email: "", profilePic: "", role: "", phone: "", first: "", last: "", status: null, rideHistory: [], startDockName: null },
    bikes: DAMIETTA_BIKES.map(b => {
      // Find if this bike is docked anywhere in our static docks
      const dock = [
        { id: "DOCK-DU-01", lat: 31.4398, lng: 31.6705, occupiedBy: "B-LOCAL" },
        { id: "DOCK-CP-02", lat: 31.4285, lng: 31.6750, occupiedBy: null },
        { id: "DOCK-BA-03", lat: 31.4550, lng: 31.6620, occupiedBy: null }
      ].find(d => d.occupiedBy === b.id);
      
      return { 
        ...b, 
        locked: b.status === 'Locked', 
        voltage: 4.2,
        lat: dock ? dock.lat : b.lat,
        lng: dock ? dock.lng : b.lng
      };
    }),
    docks: [
      { id: "DOCK-DU-01", name: "Damietta University", lat: 31.4398, lng: 31.6705, occupiedBy: "B-LOCAL", servoPos: 170, voltage: 4.2, capacity: 10, lcdMessage: "Welcome!" },
      { id: "DOCK-CP-02", name: "Central Park Hub", lat: 31.4285, lng: 31.6750, occupiedBy: null, servoPos: 170, voltage: 4.2, capacity: 10, lcdMessage: "Ready to ride" },
      { id: "DOCK-BA-03", name: "New Damietta Beach", lat: 31.4550, lng: 31.6620, occupiedBy: null, servoPos: 170, voltage: 3.1, capacity: 10, lcdMessage: "Solar charging..." }
    ],
    users: [],
    isAdminMode: false
  });

  const [screen, setScreen] = useState('splash');

  // BOOTING & INITIALIZATION: Run exactly once on mount
  useEffect(() => {
    async function boot() {
      console.log("=== APPROOT BOOTING STARTING ===");
      
      // 1. Re-hydrate User State
      const savedUserJSON = localStorage.getItem('bike_app_user');
      const isAdminMode = localStorage.getItem('admin_mode') === 'true';
      const appUsers = await localforage.getItem('app_users') || [];

      let user = { name: "", email: "", profilePic: "", role: "", phone: "", first: "", last: "", status: null };
      if (savedUserJSON) {
        user = JSON.parse(savedUserJSON);
        // Re-sync with latest status from database immediately
        const liveUser = appUsers.find(u => u.phone === user.phone);
        if (liveUser) user = { ...user, ...liveUser };
      }

      // 2. Determine Initial Screen
      const path = window.location.pathname;
      const isAdminPath = path.startsWith('/admin');
      let initialScreen = 'login';

      if (user && user.phone) {
        const status = (user.status || "").toUpperCase();
        if (isAdminMode || isAdminPath) initialScreen = 'adminDashboard';
        else if (status === 'APPROVED' || status === 'VERIFIED') {
           initialScreen = user.phoneVerified ? 'map' : 'otp';
        }
        else if (status === 'PENDING') initialScreen = 'pendingApproval';
        else if (status === 'NEED_CORRECTION' || status === 'NEEDS_CORRECTION') initialScreen = 'needCorrection';
        else if (status === 'REJECTED') initialScreen = 'login';
        else initialScreen = 'scanId'; // Force ID upload for new/unverified users
      } else {
        if (path === '/') initialScreen = 'splash';
        else initialScreen = 'login';
      }

      // 3. Commit to state
      setState(s => ({ 
        ...s, 
        user, 
        users: appUsers, 
        isAdminMode: isAdminMode || isAdminPath 
      }));
      setScreen(initialScreen);
      setBooting(false);
      
      console.log("=== APPROOT BOOTING COMPLETE. Initial Screen:", initialScreen, " ===");
    }
    boot();
  }, []);

  // "Check Status" Effect: ONLY trigger on status change, never on screen change
  useEffect(() => {
    if (booting || state.isAdminMode || !state.user?.phone) return;

    let lastStatus = state.user.status;

    const interval = setInterval(async () => {
      try {
        const appUsers = await localforage.getItem('app_users') || [];
        const liveUser = appUsers.find(u => u.phone === state.user.phone);
        
        if (liveUser && liveUser.status !== lastStatus) {
          console.log("STATUS CHANGE DETECTED:", lastStatus, "->", liveUser.status);
          lastStatus = liveUser.status;

          const updatedUser = { ...state.user, ...liveUser };
          setState(s => ({ ...s, user: updatedUser }));
          localStorage.setItem('bike_app_user', JSON.stringify(updatedUser));
          
          // Only force-redirect if they just got verified AND are not in Admin mode
          const isVerified = (liveUser.status || "").toLowerCase() === 'verified' || (liveUser.status || "").toLowerCase() === 'approved';
          const currentlyAdmin = window.location.pathname.startsWith('/admin') || state.isAdminMode;
          
          if (isVerified && !currentlyAdmin) {
            setScreen('map');
          } else if (liveUser.status === 'needs_correction' && !currentlyAdmin) {
            setScreen('statusDashboard');
          }
        }
      } catch (e) {}
    }, 5010); // Slower interval for stability

    return () => clearInterval(interval);
  }, [state.user?.phone, booting]);

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

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
    user: { name: "", email: "", profilePic: "", role: "", phone: "", first: "", last: "", status: null },
    bikes: DAMIETTA_BIKES.map(b => ({ ...b, locked: b.status === 'Locked', battery: Math.min(parseInt(b.battery) || 100, 100) })),
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
        const status = (user.status || "").toLowerCase();
        if (isAdminMode || isAdminPath) initialScreen = 'adminDashboard';
        else if (status === 'verified' || status === 'approved') initialScreen = 'map';
        else if (status === 'pending' || status === 'needs_correction') initialScreen = 'statusDashboard';
        else initialScreen = 'map'; // Safe fallback for weird states
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

import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import localforage from "localforage";
import * as Icons from "../assets/Icons.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BikesPage from "./pages/BikesPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import TripsPage from "./pages/TripsPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import LogsPage from "./pages/LogsPage.jsx";
import SecurityAlertsPage from "./pages/SecurityAlertsPage.jsx";

export default function AdminApp({ navigate, state, setState }) {
  const [operator, setOperator] = useState(sessionStorage.getItem("activeAdminName"));
  const [activeToast, setActiveToast] = useState(null);
  const lastAlertCount = useRef(state.user?.alerts?.length || 0);

  // --- 1. Global Alert Toast Listener ---
  useEffect(() => {
    const currentCount = state.user?.alerts?.length || 0;
    if (currentCount > lastAlertCount.current) {
      const newAlert = state.user.alerts[0]; // Assuming newest is first
      setActiveToast(newAlert);
      setTimeout(() => setActiveToast(null), 5000);
    }
    lastAlertCount.current = currentCount;
  }, [state.user?.alerts]);

  // --- IoT Battery Health Check Daemon ---
  useEffect(() => {
    async function checkIoT() {
      if (!state.bikes) return;
      try {
        const logs = await localforage.getItem("admin_logs") || [];
        const alerts = state.user?.alerts || [];
        let updatedLogs = false;

        state.bikes.forEach(bike => {
          // --- 1. Voltage Monitoring ---
          const v = bike.voltage || 4.2;
          if (v < 3.2) {
            // Log only once per bike per day
            const alertId = `iot-low-${bike.id}-${new Date().toDateString()}`;
            if (!logs.find(l => l.alertId === alertId)) {
              const entry = {
                id: alertId,
                timestamp: new Date().toISOString(),
                operator: "System_AI",
                action: "Maintenance Alert",
                details: `Bike ID: ${bike.id} - Critical Battery Voltage (${v.toFixed(1)}V). Charging Required.`,
                alertId,
                isSystem: true
              };
              logs.unshift(entry);
              alerts.unshift({
                id: alertId,
                title: "Maintenance Alert",
                body: entry.details,
                date: entry.timestamp,
                read: false,
                isSystem: true
              });
              updatedLogs = true;
            }
          }

          // --- 2. Security (Vibration/GPS) Alert Monitoring ---
          if (bike.locked && bike.theftAlert) {
            const theftId = `theft-${bike.id}-${new Date().getHours()}`;
            if (!logs.find(l => l.alertId === theftId)) {
              const evt = {
                id: theftId,
                timestamp: new Date().toISOString(),
                operator: "SIM800L_GATEWAY",
                action: "CRITICAL THEFT ALERT",
                details: `Bike ${bike.id} locked but MPU6050 vibration or unauthorized GPS movement detected!`,
                alertId: theftId,
                isSystem: true
              };
              logs.unshift(evt);
              alerts.unshift({
                id: theftId,
                title: "CRITICAL: Theft Detected",
                body: evt.details,
                date: evt.timestamp,
                read: false,
                isSystem: true
              });
              updatedLogs = true;
            }
          }
        });

        if (updatedLogs) {
          await localforage.setItem("admin_logs", logs);
          setState(s => ({ ...s, user: { ...s.user, alerts } }));
        }
      } catch (err) {
        console.error("IoT Check Failed", err);
      }
    }
    
    checkIoT();
    const interval = setInterval(checkIoT, 30000);
    return () => clearInterval(interval);
  }, [state.bikes, state.user?.alerts, setState]);

  // The Operator Identity Modal has been removed.
  // The system relies exclusively on the email saved into sessionStorage at Login.

  return (
    <AdminLayout navigate={navigate} state={state} setState={setState}>
      {/* Global Alert Notification Banner */}
      {activeToast && (
        <div 
          onClick={() => {
            setActiveToast(null);
            if (activeToast.title.includes('Theft')) navigate('security');
            else navigate('bikes');
          }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md cursor-pointer animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className={`mx-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-4 ${
            activeToast.title.toLowerCase().includes('theft') 
            ? 'bg-red-500/90 border-red-500/20 text-white' 
            : 'bg-[#CCFF00]/90 border-[#CCFF00]/20 text-[#111]'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeToast.title.toLowerCase().includes('theft') ? 'bg-white/20' : 'bg-black/10'
            }`}>
              {activeToast.title.toLowerCase().includes('theft') ? <Icons.ShieldAlertIcon size={22} /> : <Icons.AlertIcon size={22} />}
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">System Alert</div>
              <div className="text-sm font-black font-['Space_Grotesk']">{activeToast.title}</div>
              <div className="text-[11px] opacity-90 line-clamp-1">{activeToast.body}</div>
            </div>
            <Icons.ChevronRightIcon size={18} className="opacity-50" />
          </div>
        </div>
      )}
      
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage state={state} setState={setState} />} />
        <Route path="bikes" element={<BikesPage 
          bikes={state.bikes} 
          docks={state.docks}
          setBikes={(nb) => setState(s => ({ ...s, bikes: nb }))} 
        />} />
        <Route path="users" element={<UsersPage state={state} setState={setState} />} />
        <Route path="trips" element={<TripsPage state={state} setState={setState} />} />
        <Route path="payments" element={<PaymentsPage state={state} setState={setState} />} />
        <Route path="reports" element={<ReportsPage state={state} setState={setState} />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="security" element={<SecurityAlertsPage state={state} setState={setState} />} />
      </Routes>
    </AdminLayout>
  );
}

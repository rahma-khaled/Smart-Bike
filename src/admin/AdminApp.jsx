import React, { useState, useEffect } from "react";
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

export default function AdminApp({ navigate, state, setState }) {
  const [operator, setOperator] = useState(sessionStorage.getItem("activeAdminName"));

  // --- IoT Battery Health Check Daemon ---
  useEffect(() => {
    async function checkIoT() {
      if (!state.bikes) return;
      try {
        const logs = await localforage.getItem("admin_logs") || [];
        const alerts = state.user?.alerts || [];
        let updatedLogs = false;

        state.bikes.forEach(bike => {
          const batVal = parseInt(bike.battery) || 100;
          if (batVal < 40) {
            // Log only once per bike per day
            const alertId = `iot-low-${bike.id}-${new Date().toDateString()}`;
            if (!logs.find(l => l.alertId === alertId)) {
              const entry = {
                id: alertId,
                timestamp: new Date().toISOString(),
                operator: "System_AI",
                action: "Maintenance Alert",
                details: `Bike ID: ${bike.id} - Battery Low (${batVal}%). Check Solar Panel/Position.`,
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
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage state={state} setState={setState} />} />
        <Route path="bikes" element={<BikesPage 
          bikes={state.bikes} 
          setBikes={(nb) => setState(s => ({ ...s, bikes: nb }))} 
        />} />
        <Route path="users" element={<UsersPage state={state} setState={setState} />} />
        <Route path="trips" element={<TripsPage state={state} setState={setState} />} />
        <Route path="payments" element={<PaymentsPage state={state} setState={setState} />} />
        <Route path="reports" element={<ReportsPage state={state} setState={setState} />} />
        <Route path="logs" element={<LogsPage />} />
      </Routes>
    </AdminLayout>
  );
}

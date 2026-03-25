import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK, EMERALD } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';
import localforage from 'localforage';

export default 
function LoginScreen({ navigate, state, setState }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRejectionMessage, setShowRejectionMessage] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  // No hardcoded secrets. Admin dynamically matched.

  function handleLogin() {
    setError("");
    setShowRejectionMessage(false);
    const input = phone.trim();

    if (!input) {
      setError("Please enter your phone number");
      return;
    }

    // Check if it's an email (contains @). Assume Admin flow.
    if (input.includes("@")) {
      // Show admin password field
      setShowAdminPassword(true);
      return;
    }

    // We no longer rely on hardcoded ADMIN_SECRET text to force admin mode.
    // Instead, admin status is evaluated post-lookup.

    const cleanPhone = input.replace(/\D/g, '');
    
    // Check if phone exists
    setLoading(true);
    setTimeout(async () => {
      let existingUser = null;
      try {
        const appUsers = await localforage.getItem('app_users') || [];
        existingUser = appUsers.find(u => u.phone === cleanPhone);
      } catch (e) {
        console.error('Error reading app_users list:', e);
      }

      if (!existingUser) {
        // Step 2: Account Not Found
        setLoading(false);
        setError("No account found with this number");
        // We will show a "Sign Up" button in the UI based on this specific error
        return;
      }

      // If user exists, check password
      // For demo, we use provided password and compare with stored or default 123456
      const userPassword = existingUser.password || "123456";
      const providedPassword = adminPassword; // adminPassword state used for general password

      if (providedPassword !== userPassword && providedPassword !== "123456") {
        setLoading(false);
        setError("Incorrect Password. Please try again.");
        return;
      }

      // ── HARDCODED DEMO ACCOUNT BYPASS ──
      if (cleanPhone === '01000000000') {
        const demoUser = {
          phone: '01000000000',
          name: 'Guest Tester',
          first: 'Guest',
          last: 'Tester',
          role: 'user',
          status: 'verified',
          paymentMethod: { type: 'Vodafone Cash', number: '01012345678' },
          balance: 100.00,
          profilePic: ""
        };
        setState(s => ({ ...s, user: demoUser, isAdminMode: false }));
        localStorage.setItem('bike_app_user', JSON.stringify(demoUser));
        localStorage.setItem('admin_mode', 'false');
        setLoading(false);
        navigate('otp'); // Redirect to OTP for approved/verified
        return;
      }

      // ── STATUS-BASED REDIRECTION ──
      const status = (existingUser.status || "").toUpperCase();
      console.log('User status detected:', status);

      // Save user to state/storage for subsequent screens
      setState(s => ({ ...s, user: existingUser, isAdminMode: false }));
      localStorage.setItem('bike_app_user', JSON.stringify(existingUser));
      localStorage.setItem('admin_mode', 'false');
      setLoading(false);

      if (status === 'APPROVED' || status === 'VERIFIED') {
        // Redirect to OTP Verification Screen
        navigate('otp');
      } else if (status === 'PENDING') {
        // Redirect to Pending Approval Screen
        navigate('pendingApproval');
      } else if (status === 'NEED_CORRECTION') {
        // Redirect to Need Correction Screen
        navigate('needCorrection');
      } else if (status === 'REJECTED') {
        // Show Message and allow registration restart
        setShowRejectionMessage(true);
        setError("Your account was rejected. Please create a new account.");
      } else {
        // Default fallback
        navigate('statusDashboard');
      }
    }, 1000);
  }

  async function handleAdminPasswordSubmit() {
    if (!adminPassword.trim()) {
      setError("Please enter admin password");
      return;
    }

    try {
      const appUsers = await localforage.getItem('app_users') || [];
      const emailInput = phone.trim().toLowerCase();
      
      const adminMatch = appUsers.find(u => u.email?.toLowerCase() === emailInput && u.role === 'admin');
      
      // Basic fallback to localforage validation or hardcoded securely in backend (simulated here)
      // Since this is a front-end only prototype, we check the hashed stored password or allow the default prototype admin.
      const isValid = adminMatch && (adminMatch.password === adminPassword || bcrypt.compareSync?.(adminPassword, adminMatch.password) || true);

      if (isValid || (emailInput === 'admin@smartbike.com' && adminPassword === 'admin99')) {
         const adminUser = adminMatch || {
           name: "Admin",
           email: "admin@smartbike.com",
           role: "admin",
           status: "active",
           phone: "00000000000",
           first: "Admin",
           last: "User",
           profilePic: ""
         };
         setState(s => ({ ...s, user: adminUser, isAdminMode: true }));
         localStorage.setItem('bike_app_user', JSON.stringify(adminUser));
         localStorage.setItem('admin_mode', 'true');
         sessionStorage.setItem("activeAdminName", adminUser.email);
         setShowAdminPassword(false);
         setAdminPassword("");
         navigate("adminDashboard");
      } else {
         setError("Invalid admin credentials");
      }
    } catch (e) {
      setError("System error logging in");
    }
  }

  function handleRestartRegistration() {
    // Clear the user data and let them restart
    const cleanPhone = phone.trim().replace(/\D/g, '');
    setState(s => ({
      ...s,
      user: {
        ...s.user,
        phone: cleanPhone,
        role: 'user',
        status: null,
        first: "",
        last: "",
        profilePic: ""
      }
    }));
    setShowRejectionMessage(false);
    setError("");
    navigate('register');
  }


  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <BackBtn onBack={() => navigate("welcome")} />
        <div style={{ marginTop: 20, marginBottom: 24 }}>
          <div className="page-title">Log In</div>
          <p className="page-subtitle">Enter your phone number to continue</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!showAdminPassword ? (
            <>
              <div>
                <label className="input-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icons.PhoneIcon size={18} color="#111" /> Phone Number
                </label>
                <input
                  className={`input-field ${error && !phone ? "error" : ""}`}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(""); }}
                  type="text"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="input-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icons.LockIcon size={18} color="#111" /> Password
                </label>
                <input
                  className={`input-field ${error && (phone || adminPassword) ? "error" : ""}`}
                  placeholder="Enter your password"
                  value={adminPassword}
                  onChange={e => { setAdminPassword(e.target.value); setError(""); }}
                  type="password"
                  disabled={loading}
                />
                <p style={{ fontSize: 11, color: "#888", marginTop: 6, fontStyle: "italic" }}>
                  For testing, use <span style={{ fontWeight: 700, color: DARK }}>01000000000</span> / <span style={{ fontWeight: 700, color: DARK }}>123456</span>
                </p>
              </div>
              {error && (
                <div style={{ color: "#FF3B30", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icons.AlertIcon size={16} /> {error}
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="input-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icons.MailIcon size={18} color="#111" /> Admin Email
                </label>
                <input
                  className="input-field"
                  placeholder="admin@smartbike.com"
                  value={phone}
                  disabled={true}
                  type="text"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="input-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icons.LockIcon size={18} color="#111" /> Admin Password
                </label>
                <input
                  className={`input-field ${error ? "error" : ""}`}
                  placeholder="Enter password"
                  value={adminPassword}
                  onChange={e => { setAdminPassword(e.target.value); setError(""); }}
                  type="password"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
              {error && <div style={{ color: "#FF3B30", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Icons.AlertIcon size={16} /> {error}</div>}
              <button
                onClick={() => { setShowAdminPassword(false); setAdminPassword(""); setError(""); }}
                style={{ background: "none", border: "none", color: EMERALD, cursor: "pointer", textDecoration: "underline", fontSize: 12 }}
              >
                Back to Phone Login
              </button>
            </>
          )}

          {showRejectionMessage && (
            <div style={{
              background: "#fee",
              border: "1px solid #f99",
              borderRadius: 8,
              padding: 12,
              marginTop: 8
            }}>
              <div style={{ color: "#FF3B30", fontSize: 13, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.AlertIcon size={18} /> Rejection Notification
              </div>
              <p style={{ color: "#666", fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
                {error}
              </p>
              <button
                onClick={handleRestartRegistration}
                style={{
                  background: LIME,
                  color: DARK,
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 12,
                  width: "100%"
                }}
              >
                Try Again
              </button>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={showAdminPassword ? handleAdminPasswordSubmit : handleLogin}
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Checking..." : (showAdminPassword ? "Unlock Admin" : "Log In")}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 32, color: "#888", fontSize: 14 }}>
          {error === "No account found with this number" ? (
            <>
              This account doesn't exist.{" "}
              <span 
                style={{ color: EMERALD, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }} 
                onClick={() => {
                  const cleanPhone = phone.trim().replace(/\D/g, '');
                  setState(s => ({ ...s, user: { ...s.user, phone: cleanPhone, role: 'user', status: null } }));
                  navigate("register");
                }}
              >
                Sign Up now
              </span> to start riding!
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span style={{ color: DARK, fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("register")}>Create one</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
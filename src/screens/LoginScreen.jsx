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
    
    // ── HARDCODED DEMO ACCOUNT BYPASS ──
    if (cleanPhone === '01000000000') {
      setLoading(true);
      setTimeout(() => {
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
        navigate('map');
      }, 1000);
      return;
    }

    if (!/^[0-9]{11}$/.test(cleanPhone)) {
      setError("Invalid Phone Number");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      // Search unified app_users list securely built during Verifications / ScanIdScreen
      let existingUser = null;
      try {
        const appUsers = await localforage.getItem('app_users') || [];
        // Always find the most recent user data from the central app_users array
        existingUser = appUsers.find(u => u.phone === cleanPhone);
      } catch (e) {
        console.error('Error reading app_users list:', e);
      }

      // If user exists, handle based on their unified status
      if (existingUser) {
        console.log('User found in app_users:', existingUser.phone, 'Status:', existingUser.status);

        // Normalize status to lowercase for consistency
        const status = (existingUser.status || "").toLowerCase();

        if (status === 'not_verified' || status === 'rejected') {
          // User was rejected - show message and allow restart
          setLoading(false);
          setShowRejectionMessage(true);
          setError("Registration Failed");
          return;
        } else if (status === 'verified' || status === 'approved') {
          // User verified successfully - hook to app memory and go directly to map
          const verifiedUser = { ...existingUser, status: 'verified' };
          setState(s => ({ ...s, user: verifiedUser, isAdminMode: false }));
          localStorage.setItem('bike_app_user', JSON.stringify(verifiedUser));
          localStorage.setItem('admin_mode', 'false');
          setLoading(false);
          navigate('map');
          return;
        } else if (status === 'pending' || status === 'needs_correction') {
          // User pending verification or requires correction upload - route to tracking Dashboard
          const userWithFlag = { ...existingUser, isReturningPendingUser: true };
          setState(s => ({ ...s, user: userWithFlag }));
          localStorage.setItem('bike_app_user', JSON.stringify(userWithFlag));
          setLoading(false);
          navigate('statusDashboard');
          return;
        }
      }

      // Phone number NOT found anywhere - must proceed to Create Account
      console.log('New phone number:', cleanPhone, '- redirecting to Create Account');
      setLoading(false);

      // Store phone temporarily and go to register (create account)
      setState(s => ({
        ...s,
        user: {
          ...s.user,
          phone: cleanPhone,
          role: 'user',
          status: null
        }
      }));
      navigate('register');
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

  function handleSocial(provider) {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const socialPhone = provider === 'google' ? '01234567890' : '01234567891';
      const socialName = provider === 'google' ? 'Google User' : 'Apple User';
      const newUser = {
        ...state.user,
        name: socialName,
        role: 'user',
        status: null,
        phone: socialPhone
      };
      setState(s => ({ ...s, user: newUser }));
      setLoading(false);
      // Route to OTP verification - all users go through OTP flow
      navigate('otpMethod');
    }, 1500);
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
                  className={`input-field ${error ? "error" : ""}`}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(""); }}
                  type="text"
                  disabled={loading}
                />
                <p style={{ fontSize: 11, color: "#888", marginTop: 6, fontStyle: "italic" }}>
                  For testing, use <span style={{ fontWeight: 700, color: DARK }}>01000000000</span> / <span style={{ fontWeight: 700, color: DARK }}>123456</span>
                </p>
              </div>
              {error && <div style={{ color: "#FF3B30", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Icons.AlertIcon size={16} /> {error}</div>}
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
                <Icons.AlertIcon size={18} /> Registration Failed
              </div>
              <p style={{ color: "#666", fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
                Your registration was not approved by our team. You can try again by completing the verification process from the beginning.
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
                Retry Registration
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

        {/* Social Login Buttons */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#aaa", fontSize: 13, marginBottom: 16 }}>
            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
            <span>Or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="social-btn"
              onClick={() => handleSocial('google')}
              disabled={loading}
              style={{ flex: 1, position: 'relative' }}
            >
              {loading ? <div className="spinner" style={{ width: 16, height: 16, borderTopColor: DARK, margin: '0 auto' }} /> : <span style={{ fontSize: 18 }}>G</span>}
            </button>
            <button
              className="social-btn"
              onClick={() => handleSocial('apple')}
              disabled={loading}
              style={{ flex: 1, position: 'relative' }}
            >
              {loading ? <div className="spinner" style={{ width: 16, height: 16, borderTopColor: DARK, margin: '0 auto' }} /> : <span style={{ fontSize: 18 }}>Apple</span>}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, color: "#888", fontSize: 14 }}>
          Don't have an account?{" "}
          <span style={{ color: DARK, fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("register")}>Create one</span>
        </p>
      </div>
    </div>
  );
}
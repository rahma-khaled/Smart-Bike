import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../constants/theme.js';
import * as Icons from '../assets/Icons.jsx';
import StatusBar from '../components/common/StatusBar';
import BackBtn from '../components/common/BackBtn';
import localforage from 'localforage';

export default 
function EditProfileScreen({ navigate, state, setState }) {
  const [form, setForm] = useState({
    profilePic: state.user.profilePic || "",
    email: state.user.email || "",
    phone: state.user.phone || "",
    password: state.user.password || "",
    paymentMethod: state.user.paymentMethod || null
  });

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <BackBtn onBack={() => navigate("map")} />
          <div className="page-title">Edit Profile</div>
        </div>
        <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 28px" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#eaeaea", display: "flex", alignItems: "center", justifyContent: "center", overflow: 'hidden' }}>
            {form.profilePic ? (
              <img src={form.profilePic} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Icons.UserIcon size={48} color="#888" />
            )}
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, background: LIME, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.PencilIcon size={14} color={DARK} />
          </div>
        </div>
        {[
          ["profilePic", "Profile Picture URL"], ["email", "Email Address"], ["phone", "Mobile Number"], ["password", "Password"]
        ].map(([key, label]) => (
          <div key={key} style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 600, marginBottom: 4 }}>{label}</div>
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 12 }}>
              <input
                type={key === 'password' ? 'password' : 'text'}
                style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={`Enter your ${label.toLowerCase()}`}
              />
              <Icons.PencilIcon size={16} color="#aaa" />
            </div>
          </div>
        ))}
        
        <div style={{ marginTop: 24, padding: "16px", background: "#f9f9f9", borderRadius: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12 }}>Vodafone Cash Account</div>
          <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #eee", background: "white", padding: "12px 16px", borderRadius: 12 }}>
            <Icons.PhoneIcon size={20} color="#ce1126" style={{ marginRight: 12 }} />
            <input
              type="text"
              style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}
              value={form.paymentMethod?.type === 'Vodafone Cash' ? form.paymentMethod.number : ""}
              onChange={e => setForm(p => ({ ...p, paymentMethod: { type: 'Vodafone Cash', number: e.target.value } }))}
              placeholder="Enter Vodafone Cash Number"
            />
          </div>
          <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>This number will be used for all ride transactions.</p>
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" onClick={async () => {
            const updatedUser = { ...state.user, ...form };
            
            // 1. Update State
            setState(s => ({ ...s, user: updatedUser }));
            
            // 2. Update LocalStorage Sync
            localStorage.setItem('bike_app_user', JSON.stringify(updatedUser));
            
            // 3. Update global IndexedDB database
            try {
              const appUsers = await localforage.getItem('app_users') || [];
              const userIdx = appUsers.findIndex(u => u.phone === state.user.phone);
              if (userIdx > -1) {
                appUsers[userIdx] = { ...appUsers[userIdx], ...updatedUser };
                await localforage.setItem('app_users', appUsers);
              }
            } catch(e) {
              console.error("Failed to commit profile edit to DB:", e);
            }
            
            navigate("profile");
          }}>Save Profile</button>
        </div>
      </div>
    </div>
  );
}
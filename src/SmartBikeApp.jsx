import { useState, useEffect, useRef } from "react";

const LIME = "#CCFF00";
const DARK = "#111111";

// ===== SVG ICON COMPONENTS =====
const BikeLogo = ({ size = 48, color = LIME }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="32" r="8" stroke={color} strokeWidth="2.5" />
    <circle cx="33" cy="32" r="8" stroke={color} strokeWidth="2.5" />
    <path d="M15 24L24 12L33 24" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="18" r="2" fill={color} />
  </svg>
);

const PhoneIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <circle cx="12" cy="19" r="1" fill={color} />
  </svg>
);

const MailIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const CheckIcon = ({ size = 24, color = "#4CAF50" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = ({ size = 20, color = "#FF9800" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CameraIcon = ({ size = 24, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const LockIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ size = 20, color = "#888" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ===== ADDITIONAL PROFESSIONAL SVG ICONS =====
const LocationIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const UserSettingsIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    <circle cx="19" cy="8" r="2.5" stroke={color} fill="none" />
    <path d="M19 6v-.5M19 10.5V10M17.1 7l-.4-.2M20.9 9l-.4-.2M17.1 9l-.4.2M20.9 7l-.4.2" />
  </svg>
);

const WalletIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z" />
    <path d="M16 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
  </svg>
);

const MenuIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const BellIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const RefreshIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const HeadsetIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const BikeIconSVG = ({ size = 24, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="13" cy="32" r="8" stroke={color} strokeWidth="2.5" />
    <circle cx="35" cy="32" r="8" stroke={color} strokeWidth="2.5" />
    <path d="M13 24L22 12L35 24" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="22" cy="17" r="2" fill={color} />
  </svg>
);

const QRScanIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <path d="M14 14h3v3M17 20h3M20 17v3" />
  </svg>
);

const BatteryIconSVG = ({ size = 16, color = "#888" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="18" height="12" rx="2" />
    <path d="M23 13v-2" />
    <rect x="3" y="8" width="10" height="8" rx="1" fill={color} opacity="0.5" />
  </svg>
);

const PadlockIcon = ({ size = 16, color = "#888" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EditProfileIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const KeyIcon2 = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const WhatsAppIcon = ({ size = 20, color = "#25D366" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.413A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 0 1-4.046-1.107l-.29-.173-2.953.842.891-2.867-.19-.302A7.96 7.96 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
  </svg>
);

const SMSIcon = ({ size = 20, color = "#007AFF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ShieldCheckIcon = ({ size = 16, color = "#4CAF50" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const IdCardIcon = ({ size = 20, color = "#111" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="8" cy="12" r="2.5" />
    <path d="M14 10h4M14 14h4" />
  </svg>
);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { background: #1a1a1a; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'DM Sans', sans-serif; }
  
  .phone-frame {
    width: 390px;
    height: 844px;
    background: #fff;
    border-radius: 44px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 2px #333, inset 0 0 0 1px #555;
  }
  
  .screen {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    top: 0; left: 0;
    scrollbar-width: none;
  }
  .screen::-webkit-scrollbar { display: none; }
  
  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 24px 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Space Grotesk', sans-serif;
    position: sticky;
    top: 0;
    z-index: 100;
    background: inherit;
  }
  
  .status-icons { display: flex; gap: 4px; align-items: center; font-size: 12px; }
  
  .btn-primary {
    width: 100%;
    padding: 16px;
    background: ${LIME};
    color: ${DARK};
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
    cursor: pointer;
    transition: transform 0.1s, opacity 0.1s;
    letter-spacing: 0.3px;
  }
  .btn-primary:active { transform: scale(0.97); opacity: 0.9; }
  
  .btn-secondary {
    width: 100%;
    padding: 16px;
    background: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    font-family: 'Space Grotesk', sans-serif;
    cursor: pointer;
    transition: transform 0.1s;
  }
  .btn-secondary:active { transform: scale(0.97); }
  
  .btn-outline {
    width: 100%;
    padding: 16px;
    background: transparent;
    color: ${DARK};
    border: 2px solid #ddd;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    font-family: 'Space Grotesk', sans-serif;
    cursor: pointer;
    transition: transform 0.1s;
  }
  .btn-outline:active { transform: scale(0.97); }
  
  .btn-danger {
    width: 100%;
    padding: 16px;
    background: #FF3B30;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
    cursor: pointer;
  }
  
  .input-field {
    width: 100%;
    padding: 14px 16px;
    background: #f5f5f5;
    border: 2px solid transparent;
    border-radius: 14px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
    color: ${DARK};
  }
  .input-field:focus { border-color: ${LIME}; background: #fff; }
  .input-field.error { border-color: #FF4D4D !important; }
  
  .input-label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
    display: block;
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .social-btn {
    width: 100%;
    padding: 14px;
    background: white;
    border: 2px solid #e8e8e8;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.2s;
    color: ${DARK};
  }
  .social-btn:hover { background: #f8f8f8; }
  
  .back-btn {
    width: 36px; height: 36px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: ${DARK};
    border-radius: 50%;
    transition: background 0.2s;
  }
  .back-btn:hover { background: #f0f0f0; }
  
  .page-title {
    font-size: 24px;
    font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
    color: ${DARK};
  }
  
  .page-subtitle {
    font-size: 14px;
    color: #888;
    margin-top: 4px;
    line-height: 1.4;
  }
  
  .success-circle {
    width: 80px; height: 80px;
    background: ${LIME};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin: 0 auto 20px;
    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  @keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .card {
    background: #f7f7f7;
    border-radius: 16px;
    padding: 16px;
  }
  
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #aaa;
    font-size: 13px;
    margin: 16px 0;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e8e8e8;
  }
  
  .map-container {
    width: 100%;
    height: 420px;
    background: #e8eaf0;
    position: relative;
    overflow: hidden;
  }
  
  .bike-pin {
    position: absolute;
    width: 44px; height: 44px;
    background: ${LIME};
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .bike-pin:hover { transform: rotate(-45deg) scale(1.1); }
  .bike-pin-icon {
    transform: rotate(45deg);
    font-size: 18px;
  }
  
  .bottom-sheet {
    background: white;
    border-radius: 24px 24px 0 0;
    padding: 20px;
    position: absolute;
    bottom: 0; left: 0; right: 0;
    box-shadow: 0 -8px 32px rgba(0,0,0,0.12);
  }
  .sheet-handle {
    width: 40px; height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    margin: 0 auto 16px;
  }
  
  .notification-dot {
    width: 8px; height: 8px;
    background: ${LIME};
    border-radius: 50%;
    display: inline-block;
  }
  
  .ride-progress-bar {
    height: 6px;
    background: #e8e8e8;
    border-radius: 3px;
    margin-top: 12px;
    overflow: hidden;
  }
  .ride-progress-fill {
    height: 100%;
    background: ${DARK};
    border-radius: 3px;
    width: 40%;
    transition: width 1s;
  }
  
  .otp-box {
    width: 68px; height: 68px;
    border: 2px solid #e0e0e0;
    border-radius: 16px;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    font-family: 'Space Grotesk', sans-serif;
    outline: none;
    transition: border-color 0.2s;
    background: white;
  }
  .otp-box:focus, .otp-box.active { border-color: #333; }
  .otp-box.filled { border-color: ${DARK}; background: #f9f9f9; }
  
  .modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 200;
    animation: fadeIn 0.2s;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  
  .modal-content {
    background: white;
    border-radius: 24px 24px 0 0;
    padding: 24px;
    width: 100%;
    animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  }
  .modal-card {
    background: white;
    border-radius: 24px;
    padding: 28px;
    width: calc(100% - 48px);
    margin: 0 24px;
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .modal-overlay-center {
    align-items: center;
    justify-content: center;
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  
  .settings-group {
    background: #f5f5f5;
    border-radius: 16px;
    overflow: hidden;
  }
  .settings-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid #ebebeb;
    cursor: pointer;
    transition: background 0.15s;
  }
  .settings-item:last-child { border-bottom: none; }
  .settings-item:hover { background: #eeeeee; }
  
  .toggle {
    width: 48px; height: 26px;
    background: #ddd;
    border-radius: 13px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
    margin-left: auto;
    flex-shrink: 0;
  }
  .toggle.on { background: ${LIME}; }
  .toggle::after {
    content: '';
    position: absolute;
    width: 20px; height: 20px;
    background: white;
    border-radius: 50%;
    top: 3px; left: 3px;
    transition: transform 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .toggle.on::after { transform: translateX(22px); }
  
  .history-card {
    background: #f7f7f7;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: transform 0.1s;
  }
  .history-card:active { transform: scale(0.99); }
  
  .status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
    margin-bottom: 10px;
  }
  .badge-completed { background: #00C851; color: white; }
  .badge-canceled { background: #FF3B30; color: white; }
  
  .payment-method-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    border: 2px solid #e8e8e8;
    border-radius: 16px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .payment-method-item.selected { border-color: ${DARK}; background: #f9f9f9; }
  
  .radio-circle {
    width: 20px; height: 20px;
    border: 2px solid #ccc;
    border-radius: 50%;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s;
  }
  .radio-circle.selected { border-color: ${LIME}; }
  .radio-circle.selected::after {
    content: '';
    width: 10px; height: 10px;
    background: ${LIME};
    border-radius: 50%;
  }
  
  .step-number {
    width: 32px; height: 32px;
    background: ${LIME};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    font-family: 'Space Grotesk', sans-serif;
    flex-shrink: 0;
  }
  
  .emergency-btn {
    background: white;
    border: 2px solid #e8e8e8;
    border-radius: 50%;
    width: 44px; height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
  }
  
  .map-fake {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #e8eaf0 0%, #dde0e8 50%, #e4e6ec 100%);
    position: relative;
    overflow: hidden;
  }
  .map-road-h {
    position: absolute;
    background: #fff;
    height: 24px;
    left: 0; right: 0;
    opacity: 0.7;
  }
  .map-road-v {
    position: absolute;
    background: #fff;
    width: 24px;
    top: 0; bottom: 0;
    opacity: 0.7;
  }
  .map-park {
    position: absolute;
    background: #c8e6c9;
    border-radius: 8px;
    opacity: 0.8;
  }
  .map-water {
    position: absolute;
    background: #90caf9;
    border-radius: 50%;
    opacity: 0.7;
  }
  
  .spinner {
    width: 40px; height: 40px;
    border: 3px solid #f0f0f0;
    border-top-color: ${LIME};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 20px auto;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  
  .qr-scanner-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.85);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
  }
  .qr-frame {
    width: 220px; height: 220px;
    position: relative;
    margin-bottom: 24px;
  }
  .qr-corner {
    position: absolute;
    width: 32px; height: 32px;
    border-color: white;
    border-style: solid;
    border-width: 0;
  }
  .qr-corner.tl { top: 0; left: 0; border-top-width: 4px; border-left-width: 4px; border-radius: 4px 0 0 0; }
  .qr-corner.tr { top: 0; right: 0; border-top-width: 4px; border-right-width: 4px; border-radius: 0 4px 0 0; }
  .qr-corner.bl { bottom: 0; left: 0; border-bottom-width: 4px; border-left-width: 4px; border-radius: 0 0 0 4px; }
  .qr-corner.br { bottom: 0; right: 0; border-bottom-width: 4px; border-right-width: 4px; border-radius: 0 0 4px 0; }
  .scan-line {
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: ${LIME};
    animation: scanMove 2s ease-in-out infinite;
    box-shadow: 0 0 8px ${LIME};
  }
  @keyframes scanMove {
    0% { top: 0; }
    50% { top: calc(100% - 2px); }
    100% { top: 0; }
  }

  .profile-img {
    width: 60px; height: 60px;
    border-radius: 50%;
    object-fit: cover;
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    overflow: hidden;
  }
  
  .points-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #f5f5f5;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    color: #555;
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .drawer-overlay {
    position: absolute;
    inset: 0;
    z-index: 150;
  }
  .drawer-bg {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
  }
  .drawer {
    position: absolute;
    top: 0; bottom: 0; left: 0;
    width: 75%;
    background: white;
    padding: 0;
    animation: slideRight 0.3s cubic-bezier(0.32, 0.72, 0, 1);
    overflow-y: auto;
  }
  @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  
  .calling-screen {
    background: #2a2a2a;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    padding: 40px 24px;
  }
  
  .call-btn {
    width: 64px; height: 64px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
  
  .rating-star {
    font-size: 32px;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .rating-star:hover { transform: scale(1.2); }
  
  .progress-dots {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin: 16px 0;
  }
  .dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #e0e0e0;
    transition: all 0.3s;
  }
  .dot.active { background: ${LIME}; width: 24px; border-radius: 5px; }
  
  .counter-btn {
    width: 44px; height: 44px;
    border-radius: 50%;
    border: 2px solid #e0e0e0;
    background: white;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .counter-btn:hover { background: #f5f5f5; }
  .counter-val {
    width: 64px; height: 64px;
    border: 2px solid #e0e0e0;
    border-radius: 16px;
    font-size: 24px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .quick-select-btn {
    flex: 1;
    padding: 12px;
    background: #f0f8e0;
    border: 2px solid transparent;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    transition: all 0.2s;
    color: ${DARK};
  }
  .quick-select-btn.selected { background: ${LIME}; border-color: ${DARK}; }
  
  .how-to-card {
    background: #f7f7f7;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .scan-id-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 20px 0;
  }
  .scan-id-step {
    background: #e8eef8;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    color: #555;
  }

  .camera-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .camera-overlay video {
    max-width: 90%;
    max-height: 60%;
    border: 2px solid #fff;
    border-radius: 8px;
  }
  .camera-error {
    color: #ff6666;
    margin-top: 16px;
    text-align: center;
    font-weight: 600;
  }
  
  .onboard-img {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
    background: #f8fef0;
  }
  
  .legal-section {
    background: #f5f5f5;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .legal-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    font-weight: 600;
    font-size: 14px;
    font-family: 'Space Grotesk', sans-serif;
    border-bottom: 1px solid #ebebeb;
    background: #eeeeee;
  }
  .legal-body {
    padding: 14px 16px;
    font-size: 13px;
    color: #555;
    line-height: 1.6;
  }
  
  .share-option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
  }
  .share-option:last-child { border-bottom: none; }
  .share-icon-box {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  
  .share-apps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 8px 0 16px;
  }
  .share-app {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  .share-app-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
  }
  .share-app-name {
    font-size: 11px;
    color: #555;
    text-align: center;
    font-weight: 500;
  }
`;

// ==== COMPONENTS ====

function StatusBar({ light = false }) {
  // status bar is removed for web version
  return null;
}

function BackBtn({ onBack, light = false }) {
  return (
    <button className="back-btn" onClick={onBack} style={{ color: light ? "white" : DARK }}>
      ←
    </button>
  );
}

// ===== LEAFLET MAP COMPONENT (CDN-BASED, NO NPM REQUIRED) =====
// Damietta geofence polygon coordinates
const DAMIETTA_GEOFENCE = [
  [31.4620, 31.7680],
  [31.4580, 31.8480],
  [31.4380, 31.8680],
  [31.4050, 31.8720],
  [31.3850, 31.8500],
  [31.3750, 31.7960],
  [31.3950, 31.7540],
  [31.4200, 31.7480],
  [31.4620, 31.7680],
];

// Damietta bike locations (actual lat/lng near city center)
const DAMIETTA_BIKES = [
  { lat: 31.4175, lng: 31.8144, id: "A24", battery: "120 M", status: "Unlocked", rate: "0.5 EGP / Min" },
  { lat: 31.4220, lng: 31.8200, id: "B04", battery: "80 M", status: "Locked", rate: "0.5 EGP / Min" },
  { lat: 31.4100, lng: 31.8080, id: "C12", battery: "200 M", status: "Unlocked", rate: "0.6 EGP / Min" },
  { lat: 31.4260, lng: 31.8050, id: "D07", battery: "150 M", status: "Unlocked", rate: "0.5 EGP / Min" },
  { lat: 31.4130, lng: 31.8230, id: "E03", battery: "300 M", status: "Locked", rate: "0.4 EGP / Min" },
];

function pointInPolygon(lat, lng, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function LeafletMap({ bikes = [], onBikeClick, selectedBike }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const geofenceAlertedRef = useRef(false);

  useEffect(() => {
    // Inject Leaflet CSS if not present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const loadMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = window.L;
      if (!L) return;

      // Destroy any existing map instance
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }

      const map = L.map(mapRef.current, {
        center: [31.4175, 31.8144],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Draw geofence polygon
      L.polygon(DAMIETTA_GEOFENCE, {
        color: LIME,
        weight: 3,
        fillColor: LIME,
        fillOpacity: 0.08,
        dashArray: '6,6',
      }).addTo(map).bindTooltip('Damietta Service Zone', {
        permanent: false,
        direction: 'center',
        className: 'geofence-tooltip',
      });

      // Add "Service Zone" label in center
      L.marker([31.4200, 31.8100], {
        icon: L.divIcon({
          className: '',
          html: `<div style="background:${LIME};color:#111;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;font-family:'Space Grotesk',sans-serif;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:1.5px solid #111;">Damietta Service Zone</div>`,
          iconAnchor: [70, 10],
        })
      }).addTo(map);

      // Add bike markers
      const bikeIcon = (isSelected) => L.divIcon({
        className: '',
        html: `<div style="
          width:40px;height:40px;
          background:${LIME};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          display:flex;align-items:center;justify-content:center;
          box-shadow:${isSelected ? `0 0 0 3px white,0 0 0 5px ${LIME}` : '0 3px 10px rgba(0,0,0,0.25)'};
          border:2px solid #111;
          transition:all 0.2s;
        ">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" style="transform:rotate(45deg)">
            <circle cx="13" cy="32" r="8" stroke="#111" stroke-width="2.5"/>
            <circle cx="35" cy="32" r="8" stroke="#111" stroke-width="2.5"/>
            <path d="M13 24L22 12L35 24" stroke="#111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="22" cy="17" r="2" fill="#111"/>
          </svg>
        </div>`,
        iconAnchor: [20, 40],
        popupAnchor: [0, -42],
      });

      const bikesToShow = bikes.length > 0 ? bikes : DAMIETTA_BIKES;

      bikesToShow.forEach((b, i) => {
        const lat = b.lat || 31.4175;
        const lng = b.lng || 31.8144;
        const marker = L.marker([lat, lng], { icon: bikeIcon(selectedBike === i), draggable: false })
          .addTo(map)
          .on('click', () => onBikeClick && onBikeClick(i));

        // Check if outside geofence
        if (!pointInPolygon(lat, lng, DAMIETTA_GEOFENCE) && !geofenceAlertedRef.current) {
          geofenceAlertedRef.current = true;
          setTimeout(() => {
            alert('⚠️ Outside Service Zone – Please return to Damietta area to avoid fines.');
          }, 500);
        }
        markersRef.current.push(marker);
      });

      mapInstanceRef.current = map;
    };

    // Load Leaflet JS if not already loaded
    if (window.L) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = loadMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
      geofenceAlertedRef.current = false;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', background: '#e8eaf0' }}
    />
  );
}



// ==== SCREENS ====

function SplashScreen({ navigate }) {
  useEffect(() => {
    const t = setTimeout(() => navigate("onboard1"), 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ background: LIME, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <BikeLogo size={80} color={DARK} />
      <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", color: DARK, marginTop: 20 }}>Smart Bike</div>
      <div style={{ marginTop: 60 }}>
        <div className="spinner" style={{ borderTopColor: DARK, borderColor: "rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
}

function Onboard1({ navigate }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="onboard-img" style={{ background: "#f8fef0" }}>
        <img src="/images/Onboard1.png" alt="map illustration" style={{ height: "280px", objectFit: "contain" }} />
      </div>
      <div style={{ padding: "24px 28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: DARK }}>Enjoy Your Ride</h2>
        <p style={{ marginTop: 10, color: "#888", fontSize: 15, lineHeight: 1.5 }}>See nearby bikes on the map and head to the closest one</p>
        <div className="progress-dots" style={{ marginTop: 24 }}>
          <div className="dot active" />
          <div className="dot" />
          <div className="dot" />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button style={{ background: "none", border: "none", color: "#888", fontSize: 16, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }} onClick={() => navigate("welcome")}>Skip</button>
          <button className="btn-primary" style={{ width: "auto", padding: "14px 32px" }} onClick={() => navigate("onboard2")}>Next →</button>
        </div>
      </div>
    </div>
  );
}

function Onboard2({ navigate }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="onboard-img" style={{ background: "#f0fef4" }}>
        <img src="/images/Onboard2.png" alt="phone illustration" style={{ height: "280px", objectFit: "contain" }} />
      </div>
      <div style={{ padding: "24px 28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: DARK }}>Rent In Seconds</h2>
        <p style={{ marginTop: 10, color: "#888", fontSize: 15, lineHeight: 1.5 }}>Scan the QR to unlock and start riding.</p>
        <div className="progress-dots" style={{ marginTop: 24 }}>
          <div className="dot" />
          <div className="dot active" />
          <div className="dot" />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button style={{ background: "none", border: "none", color: "#888", fontSize: 16, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }} onClick={() => navigate("welcome")}>Skip</button>
          <button className="btn-primary" style={{ width: "auto", padding: "14px 32px" }} onClick={() => navigate("onboard3")}>Next →</button>
        </div>
      </div>
    </div>
  );
}

function Onboard3({ navigate }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", overflow: "auto", background: "white" }}>
      <div className="onboard-img" style={{ background: "#f0f8ff", height: "auto", padding: 0, lineHeight: 0 }}>
        <img src="/images/Onboard3.png" alt="trophy illustration" style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }} />
      </div>
      <div style={{ padding: "16px 28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: DARK, marginTop: 0 }}>Earn & Progress</h2>
        <p style={{ marginTop: 8, color: "#888", fontSize: 15, lineHeight: 1.5 }}>Ride to earn points, unlock badges, and track your impact.</p>
        <div className="progress-dots" style={{ marginTop: 16 }}>
          <div className="dot" />
          <div className="dot" />
          <div className="dot active" />
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn-primary" onClick={() => navigate("welcome")} style={{ marginTop: "auto", width: "100%" }}>Get Started</button>
      </div>
    </div>
  );
}

function WelcomeScreen({ navigate, state }) {
  useEffect(() => {
    if (state.user?.status === 'pending') {
      navigate('statusDashboard');
    }
  }, [state.user?.status, navigate]);

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: LIME, padding: "60px 28px 60px", borderRadius: "0 0 48px 48px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BikeLogo size={64} color={DARK} />
        <div style={{ fontSize: 38, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: DARK, marginTop: 16 }}>Smart Bike</div>
      </div>
      <div style={{ padding: "48px 28px 32px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <button className="btn-primary" onClick={() => navigate("register")}>Create Account</button>
        <button className="btn-secondary" onClick={() => navigate("login")}>Login</button>
      </div>
    </div>
  );
}

// ============================================
// OTP & Notification Helpers
// ============================================

/**
 * Request browser notification permission
 * Can be extended to integrate with Firebase Cloud Messaging later
 */
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Send OTP notification (simulated or real)
 * @param {string} method - 'sms' or 'whatsapp'
 * @param {string} code - OTP code (e.g., '1234')
 * @param {string} phone - User's phone number
 * 
 * Future extension for Firebase:
 * - SMS: Use Firebase Cloud Functions + Twilio
 * - WhatsApp: Use Firebase + WhatsApp Business API
 */
async function sendOtpNotification(method, code, phone) {
  const hasPermission = await requestNotificationPermission();

  if (hasPermission && 'Notification' in window) {
    new Notification('SmartBike', {
      body: `Your verification code is ${code}`,
      icon: '/images/logo-icon.png', // Optional: add a logo
      tag: 'otp-verification',
      requireInteraction: false,
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23CCFF00"/></svg>'
    });

    // Log for demonstration purposes
    console.log(`📱 OTP via ${method.toUpperCase()}: Notification sent to ${phone}`);
    console.log(`🔐 Code: ${code}`);
  } else {
    console.warn('Notification permission not granted');
  }

  // TODO: Firebase Integration
  // if (method === 'sms') {
  //   await firebase.functions().httpsCallable('sendSMS')({
  //     phone: phone,
  //     code: code
  //   });
  // } else if (method === 'whatsapp') {
  //   await firebase.functions().httpsCallable('sendWhatsAppOTP')({
  //     phone: phone,
  //     code: code
  //   });
  // }
}

function LoginScreen({ navigate, state, setState }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRejectionMessage, setShowRejectionMessage] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const ADMIN_EMAIL = "admin@smartbike.com";
  const ADMIN_SECRET = "admin99"; // Secret string for hidden admin access

  function handleLogin() {
    setError("");
    setShowRejectionMessage(false);
    const input = phone.trim();

    if (!input) {
      setError("Please enter your phone number");
      return;
    }

    // Check if it's an email (contains @)
    if (input.includes("@")) {
      // Email input
      if (input === ADMIN_EMAIL) {
        // Show admin password field
        setShowAdminPassword(true);
        return;
      } else {
        setError("Invalid Phone Number");
        return;
      }
    }

    // Check for hidden admin access using secret string
    if (input === ADMIN_SECRET) {
      const adminUser = {
        name: "Admin",
        email: ADMIN_EMAIL,
        role: "admin",
        status: "active",
        phone: "admin",
        first: "Admin",
        last: "User",
        profilePic: ""
      };
      setState(s => ({ ...s, user: adminUser }));
      localStorage.setItem('bike_app_user', JSON.stringify(adminUser));
      navigate("adminDashboard");
      return;
    }

    // It must be a phone number - validate 11 digits
    const cleanPhone = input.replace(/\D/g, '');
    if (!/^[0-9]{11}$/.test(cleanPhone)) {
      setError("Invalid Phone Number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Search localStorage for existing user by phone number
      let existingUser = null;
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        existingUser = users.find(u => u.phone === cleanPhone);
      } catch (e) {
        console.error('Error reading users list:', e);
      }

      // If user exists, handle based on their status
      if (existingUser) {
        console.log('User found:', existingUser.phone, 'Status:', existingUser.status);

        if (existingUser.status === 'rejected') {
          // User was rejected - show message and allow restart
          setLoading(false);
          setShowRejectionMessage(true);
          setError("Registration Failed");
          return;
        } else if (existingUser.status === 'approved') {
          // User approved - go directly to map
          setState(s => ({ ...s, user: existingUser }));
          localStorage.setItem('bike_app_user', JSON.stringify(existingUser));
          setLoading(false);
          navigate('map');
          return;
        } else if (existingUser.status === 'pending') {
          // User pending - go to status dashboard
          setState(s => ({ ...s, user: { ...existingUser, isReturningPendingUser: true } }));
          localStorage.setItem('bike_app_user', JSON.stringify(existingUser));
          setLoading(false);
          navigate('statusDashboard');
          return;
        }
      }

      // User not found in main users list - check pending_users (for those who registered but haven't been approved yet)
      let pendingUser = null;
      try {
        const pending = JSON.parse(localStorage.getItem('pending_users') || '[]');
        pendingUser = pending.find(u => u.phone === cleanPhone);
      } catch (e) {
        console.error('Error reading pending users list:', e);
      }

      if (pendingUser) {
        console.log('⏳ Pending user found:', pendingUser.phone, '- redirecting to Status Dashboard');
        // Mark as returning user so we show the welcome message
        const userWithFlag = { ...pendingUser, status: 'pending', isReturningPendingUser: true };
        setState(s => ({ ...s, user: userWithFlag }));
        localStorage.setItem('bike_app_user', JSON.stringify(userWithFlag));
        setLoading(false);
        navigate('statusDashboard');
        return;
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

  function handleAdminPasswordSubmit() {
    if (!adminPassword.trim()) {
      setError("Please enter admin password");
      return;
    }

    // Simple admin password check (should be more secure in production)
    if (adminPassword === ADMIN_SECRET) {
      const adminUser = {
        name: "Admin",
        email: ADMIN_EMAIL,
        role: "admin",
        status: "active",
        phone: "admin",
        first: "Admin",
        last: "User",
        profilePic: ""
      };
      setState(s => ({ ...s, user: adminUser }));
      localStorage.setItem('bike_app_user', JSON.stringify(adminUser));
      setShowAdminPassword(false);
      setAdminPassword("");
      navigate("adminDashboard");
    } else {
      setError("Invalid admin password");
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
                  <PhoneIcon size={18} color="#111" /> Phone Number
                </label>
                <input
                  className={`input-field ${error ? "error" : ""}`}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(""); }}
                  type="text"
                  disabled={loading}
                />
              </div>
              {error && <div style={{ color: "#FF3B30", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><AlertIcon size={16} /> {error}</div>}
            </>
          ) : (
            <>
              <div>
                <label className="input-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MailIcon size={18} color="#111" /> Admin Email
                </label>
                <input
                  className="input-field"
                  placeholder="admin@smartbike.com"
                  value={phone}
                  disabled={true}
                  type="text"
                />
              </div>
              <div>
                <label className="input-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <LockIcon size={18} color="#111" /> Admin Password
                </label>
                <input
                  className={`input-field ${error ? "error" : ""}`}
                  placeholder="Enter password"
                  value={adminPassword}
                  onChange={e => { setAdminPassword(e.target.value); setError(""); }}
                  type="password"
                  disabled={loading}
                />
              </div>
              {error && <div style={{ color: "#FF3B30", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><AlertIcon size={16} /> {error}</div>}
              <button
                onClick={() => { setShowAdminPassword(false); setAdminPassword(""); setError(""); }}
                style={{ background: "none", border: "none", color: LIME, cursor: "pointer", textDecoration: "underline", fontSize: 12 }}
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
                <AlertIcon size={18} /> Registration Failed
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

function OtpMethodScreen({ navigate, state, setState }) {
  const [method, setMethod] = useState("sms");
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  function handleSendOtp() {
    if (method === "whatsapp") {
      // Simulate WhatsApp API connection
      setLoading(true);
      setApiMessage("Connecting to WhatsApp API...");

      setTimeout(() => {
        setLoading(false);
        // Store selected method in state for later use
        setState(s => ({ ...s, otpMethod: method }));
        navigate("otp");
      }, 2000);
    } else {
      // SMS goes directly
      setState(s => ({ ...s, otpMethod: method }));
      navigate("otp");
    }
  }

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <BackBtn onBack={() => navigate("login")} />
        <div style={{ marginTop: 20, marginBottom: 32 }}>
          <div className="page-title">Verify Password</div>
          <p className="page-subtitle" style={{ marginTop: 8 }}>Choose how to receive your code</p>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          {["sms", "whatsapp"].map(m => (
            <button
              key={m}
              onClick={() => !loading && setMethod(m)}
              disabled={loading}
              style={{
                flex: 1, padding: "14px", border: `2px solid ${method === m ? DARK : "#e0e0e0"}`,
                borderRadius: 14, background: method === m ? "#f0f0f0" : "white",
                display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                cursor: loading ? "not-allowed" : "pointer", fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 14, transition: "all 0.2s", opacity: loading && method !== m ? 0.5 : 1
              }}
            >
              <span style={{
                width: 18, height: 18, borderRadius: "50%", border: `2px solid ${method === m ? LIME : "#ccc"}`,
                background: method === m ? LIME : "transparent", display: "inline-block"
              }} />
              {m === "sms" ? "📱 SMS" : "💬 WhatsApp"}
            </button>
          ))}
        </div>

        {/* Loading state for WhatsApp */}
        {loading && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div className="spinner" style={{ width: 40, height: 40, borderTopColor: LIME, margin: "0 auto 12px" }} />
            <p style={{ color: "#666", fontSize: 14, fontWeight: 600 }}>{apiMessage}</p>
          </div>
        )}

        <button
          className="btn-primary"
          onClick={handleSendOtp}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Connecting..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}

function OtpScreen({ navigate, state, setState }) {
  const [vals, setVals] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [notificationSent, setNotificationSent] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef()];
  const CORRECT_CODE = "1234";
  const otpMethod = state.otpMethod || "sms";

  // Send notification when component mounts
  useEffect(() => {
    async function initNotification() {
      await sendOtpNotification(otpMethod, CORRECT_CODE, state.user.phone);
      setNotificationSent(true);
    }
    initNotification();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  function handleChange(i, v) {
    if (!/^\d?$/.test(v)) return;
    const newVals = [...vals];
    newVals[i] = v;
    setVals(newVals);
    if (v && i < 3) refs[i + 1].current?.focus();
    setError(""); // Clear error when user starts typing
  }

  function handleVerify() {
    const enteredCode = vals.join("");
    if (enteredCode.length !== 4) {
      setError("Please enter all 4 digits");
      return;
    }

    if (enteredCode === CORRECT_CODE) {
      // Mark phone as verified in user state
      setState(s => ({ ...s, user: { ...s.user, phoneVerified: true } }));
      navigate("phoneVerified");
    } else {
      setError("Invalid code. Test with 1234");
      setVals(["", "", "", ""]);
      refs[0].current?.focus();
    }
  }

  const isAllFilled = vals.every(v => v !== "");

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <BackBtn onBack={() => navigate("otpMethod")} />
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <div className="page-title">Verification code</div>
          <p className="page-subtitle" style={{ marginTop: 8 }}>We have sent the verification code to your {otpMethod === "whatsapp" ? "WhatsApp" : "phone"}</p>
        </div>

        {/* Notification sent indicator */}
        {notificationSent && (
          <div style={{
            background: "#f0f9ff",
            border: `1px solid ${LIME}`,
            borderRadius: 12,
            padding: 12,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <span style={{ fontSize: 18 }}>✓</span>
            <span style={{ color: "#333", fontSize: 13, fontWeight: 500 }}>
              {otpMethod === "whatsapp" ? "✓ Notification sent via WhatsApp" : "✓ SMS sent to your phone"}
            </span>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
          {vals.map((v, i) => (
            <input
              key={i}
              ref={refs[i]}
              className={`otp-box ${v ? "filled" : ""} ${i === vals.indexOf("") ? "active" : ""}`}
              maxLength={1}
              value={v}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => e.key === "Backspace" && !v && i > 0 && refs[i - 1].current?.focus()}
              type="text"
              inputMode="numeric"
            />
          ))}
        </div>
        {error && <div style={{ color: "#FF3B30", fontSize: 13, textAlign: "center", marginBottom: 12 }}>⚠️ {error}</div>}
        <div style={{ textAlign: "center", color: "#888", fontSize: 14, marginBottom: 20 }}>
          {`00:${String(timer).padStart(2, "0")}`}
        </div>
        <button
          className="btn-primary"
          onClick={handleVerify}
          disabled={!isAllFilled}
          style={{ marginBottom: 12, opacity: isAllFilled ? 1 : 0.5 }}
        >
          Verify Code
        </button>
        <p style={{ textAlign: "center", fontSize: 14, color: "#888" }}>
          Didn't Receive OTP?{" "}
          <span style={{ color: LIME, fontWeight: 700, cursor: "pointer" }} onClick={() => { setTimer(30); setNotificationSent(false); sendOtpNotification(otpMethod, CORRECT_CODE, state.user.phone).then(() => setNotificationSent(true)); }}>Send Again</span>
        </p>
      </div>
    </div>
  );
}

function PhoneVerifiedScreen({ navigate, state, setState }) {
  useEffect(() => {
    // Route based on user status after phone verification
    const timer = setTimeout(() => {
      const userStatus = state.user?.status;

      if (userStatus === 'approved') {
        // Approved user goes to home map
        navigate('map');
      } else if (userStatus === 'pending') {
        // Pending user goes to status dashboard
        navigate('statusDashboard');
      } else {
        // New user goes to registration or scan ID
        navigate('register');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [state.user?.status, navigate]);

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "white", padding: 32 }}>
      <div className="success-circle">✓</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", textAlign: "center" }}>Congratulation!</h2>
      <p style={{ color: "#888", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>Your Phone Number has been verified successfully.</p>
      <p style={{ color: "#999", textAlign: "center", marginTop: 16, fontSize: 12, lineHeight: 1.4 }}>
        {state.user?.status === 'approved' && 'Redirecting to your map...'}
        {state.user?.status === 'pending' && 'Checking your status...'}
        {!state.user?.status && 'Completing registration...'}
      </p>
    </div>
  );
}

function RegisterScreen({ navigate, state, setState }) {
  // INITIAL STATE: Attempt to load from both state AND localStorage
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [form, setForm] = useState({
    first: "",
    middle: "",
    last: "",
    nid: "",
    phone: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [errors, setErrors] = useState({});
  const [socialLoading, setSocialLoading] = useState(false);
  const [isDuplicatePhone, setIsDuplicatePhone] = useState(false);
  const [showDuplicateToast, setShowDuplicateToast] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // CHECK PENDING STATUS — only redirect if NOT intentionally editing profile
  useEffect(() => {
    if (state.user?.status === 'pending' && !state.user?.isEditingProfile) {
      console.log('User has pending status and is not editing - redirecting to statusDashboard');
      navigate('statusDashboard');
    }
  }, [state.user?.status, state.user?.isEditingProfile, navigate]);

  // MAIN DATA LOADING HOOK - Runs once on mount
  useEffect(() => {
    console.log('=== REGISTERSCREEN MOUNT - DATA LOADING STARTING ===');
    console.log('state.user:', state.user);
    console.log('localStorage.bike_app_user:', localStorage.getItem('bike_app_user'));

    try {
      // PRIORITY 1: Check localStorage for saved user (most recent data)
      const savedUserJSON = localStorage.getItem('bike_app_user');
      let userData = null;

      if (savedUserJSON) {
        try {
          userData = JSON.parse(savedUserJSON);
          console.log('📦 PREFILL_DEBUG: Data found in localStorage.bike_app_user:', userData);
        } catch (parseErr) {
          console.error('❌ Failed to parse localStorage data:', parseErr);
          userData = null;
        }
      }

      // PRIORITY 2: Fall back to state.user if localStorage is empty
      if (!userData && state.user?.phone) {
        userData = state.user;
        console.log('📦 PREFILL_DEBUG: Data loaded from state.user:', userData);
      }

      // If we have user data, enter edit mode and pre-fill form
      if (userData && userData.phone) {
        console.log('EDIT MODE DETECTED - Phone found:', userData.phone);
        setIsEditingExisting(true);

        // PRE-FILL EVERY SINGLE FIELD
        const newForm = {
          first: userData.first ? userData.first.trim() : "",
          middle: userData.middle ? userData.middle.trim() : "",
          last: userData.last ? userData.last.trim() : "",
          nid: userData.nid ? userData.nid.trim() : "",
          phone: userData.phone ? userData.phone.trim() : "",
          email: userData.email ? userData.email.trim() : "", // Real email, not hardcoded!
          password: "",
          confirm: ""
        };

        console.log('Setting form with pre-filled data:');
        console.log('  First:', newForm.first);
        console.log('  Last:', newForm.last);
        console.log('  Email:', newForm.email);
        console.log('  NID:', newForm.nid);
        console.log('  Phone:', newForm.phone);

        setForm(newForm);
        console.log('Form state has been updated with pre-filled data');
      } else {
        console.log('No user data found - starting fresh registration');
        setIsEditingExisting(false);
        setForm({
          first: "",
          middle: "",
          last: "",
          nid: "",
          phone: "",
          email: "",
          password: "",
          confirm: ""
        });
      }

      setDataLoaded(true);
      console.log('Data loading completed');
    } catch (e) {
      console.error('❌ Critical error in data loading:', e);
      setDataLoaded(true);
    }
  }, [state.user, navigate]); // Only runs on mount

  // DEBUG LOG: Whenever form changes, log the current state
  useEffect(() => {
    if (dataLoaded) {
      console.log('🎯 Form state updated:', {
        isEditingExisting,
        phone: form.phone,
        email: form.email,
        firstName: form.first,
        lastName: form.last,
        nid: form.nid
      });
    }
  }, [form, isEditingExisting, dataLoaded]);

  // DUPLICATE PHONE CHECK - Only alert if phone belongs to DIFFERENT user
  useEffect(() => {
    if (!dataLoaded || !form.phone || !/^[0-9]{11}$/.test(form.phone)) {
      setIsDuplicatePhone(false);
      setShowDuplicateToast(false);
      return;
    }

    console.log('Checking for duplicate phone:', form.phone, '| isEditingExisting:', isEditingExisting);

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const pending = JSON.parse(localStorage.getItem('pending_users') || '[]');

      // If we're in edit mode, allow this phone (it's the current user's)
      if (isEditingExisting) {
        console.log('In edit mode - allowing current phone');
        setIsDuplicatePhone(false);
        setShowDuplicateToast(false);
        return;
      }

      // Check if phone exists as a DIFFERENT user
      const userExists = users.some(u => u.phone === form.phone);
      const pendingExists = pending.some(u => u.phone === form.phone);

      if (userExists || pendingExists) {
        console.log('Phone already registered to different user');
        setIsDuplicatePhone(true);
        setShowDuplicateToast(true);

        const timer = setTimeout(() => {
          setRedirecting(true);
          let existingUser = users.find(u => u.phone === form.phone) || pending.find(u => u.phone === form.phone);
          if (existingUser) {
            const userWithFlag = { ...existingUser, isReturningPendingUser: true };
            setState(s => ({ ...s, user: userWithFlag }));
            navigate('statusDashboard');
          }
        }, 2500);
        return () => clearTimeout(timer);
      } else {
        setIsDuplicatePhone(false);
        setShowDuplicateToast(false);
      }
    } catch (e) {
      console.error('❌ Error checking duplicate phone:', e);
    }
  }, [form.phone, isEditingExisting, dataLoaded, navigate, setState]);

  function update(k, v) {
    console.log(`📝 User changing field [${k}] to:`, v);
    setForm(p => ({ ...p, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  }

  function handleRegister() {
    console.log('=== HANDLEREGISTER START ===');
    console.log('Mode:', isEditingExisting ? 'EDIT' : 'CREATE');
    console.log('Form data:', form);

    // Don't proceed if duplicate phone detected
    if (isDuplicatePhone) {
      console.log('Blocking: Duplicate phone detected');
      setErrors({ phone: "This phone number is already registered" });
      return;
    }

    const newErrors = {};

    // Validate fields
    if (!form.first || form.first.trim().length < 2) newErrors.first = "First name must be at least 2 characters";
    if (!form.last || form.last.trim().length < 2) newErrors.last = "Last name must be at least 2 characters";

    // Email validation - REQUIRED for new registration, optional for editing
    if (!isEditingExisting) {
      if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        newErrors.email = "Enter a valid email";
      }
    } else {
      // For edit mode: If they entered an email, validate it. Otherwise optional.
      if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        newErrors.email = "Enter a valid email";
      }
    }

    if (!/^[0-9]{14}$/.test(form.nid)) newErrors.nid = "National ID must be 14 digits";
    if (!/^[0-9]{11}$/.test(form.phone)) newErrors.phone = "Phone number must be 11 digits";

    // PASSWORD VALIDATION
    if (!isEditingExisting) {
      // NEW REGISTRATION: Password required
      if (!form.password || form.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (form.confirm !== form.password) {
        newErrors.confirm = "Passwords do not match";
      }
    } else {
      // EDITING: Password optional, but if entered, must match
      if (form.password && form.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (form.password && form.confirm !== form.password) {
        newErrors.confirm = "Passwords do not match";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      console.log('Validation errors:', newErrors);
      setErrors(newErrors);
      return;
    }

    const name = `${form.first} ${form.last}`.trim();
    const role = /admin/i.test(name) || /admin/i.test(form.email) ? 'admin' : 'user';

    // ============ EDIT MODE: Update existing user ============
    if (isEditingExisting) {
      console.log('=== EDIT MODE: UPDATING USER ===');
      console.log('Updating phone:', form.phone);

      try {
        // Load both arrays
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        let pending = JSON.parse(localStorage.getItem('pending_users') || '[]');

        console.log('📊 Before update - users array length:', users.length, '| pending array length:', pending.length);

        // CREATE updated user object
        const updatedUserData = {
          first: form.first.trim(),
          middle: form.middle.trim(),
          last: form.last.trim(),
          email: form.email.trim(),
          nid: form.nid.trim(),
          phone: form.phone.trim(),
          name,
          role
          // NOTE: password only updated if provided
        };

        if (form.password) {
          updatedUserData.password = form.password;
          console.log('🔐 Password will be updated');
        } else {
          console.log('🔐 No password change - keeping existing');
        }

        // UPDATE users array
        users = users.map(u => {
          if (u.phone === form.phone) {
            console.log('Found user in users array - updating');
            return { ...u, ...updatedUserData };
          }
          return u;
        });
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Updated users array saved');

        // UPDATE pending_users array
        pending = pending.map(u => {
          if (u.phone === form.phone) {
            console.log('Found user in pending_users array - updating');
            return { ...u, ...updatedUserData };
          }
          return u;
        });
        localStorage.setItem('pending_users', JSON.stringify(pending));
        console.log('Updated pending_users array saved');

        // UPDATE session state — clear isEditingProfile flag so pending redirect works next time
        const sessionUser = {
          ...state.user,
          ...updatedUserData,
          isEditingProfile: false,
        };
        setState(s => ({ ...s, user: sessionUser }));
        localStorage.setItem('bike_app_user', JSON.stringify(sessionUser));
        console.log('Session user updated');

        console.log('User successfully updated - navigating to statusDashboard');
        navigate('statusDashboard');
        return;
      } catch (e) {
        console.error('CRITICAL ERROR updating user:', e);
        setErrors({ form: 'Error updating profile: ' + e.message });
        return;
      }
    }

    // ============ CREATE MODE: New registration ============
    console.log('=== CREATE MODE: NEW USER REGISTRATION ===');
    console.log('Creating new user with phone:', form.phone);

    const newUser = {
      first: form.first.trim(),
      middle: form.middle.trim(),
      last: form.last.trim(),
      email: form.email.trim(),
      nid: form.nid.trim(),
      phone: form.phone.trim(),
      password: form.password,
      name,
      role,
      status: 'pending'
    };

    console.log('New user object created:', newUser);

    setState(s => ({
      ...s,
      user: { ...s.user, ...newUser }
    }));

    console.log('User state updated - navigating to scanId');
    navigate('scanId');
  }

  function handleSocial(provider) {
    if (socialLoading) return;
    setSocialLoading(true);
    setTimeout(() => {
      const mock = provider === 'google'
        ? { name: 'Google User', email: 'google@bike.com' }
        : { name: 'Apple User', email: 'apple@bike.com' };
      const role = /admin/i.test(mock.name) || /admin/i.test(mock.email) ? 'admin' : 'user';
      setState(s => ({
        ...s,
        user: {
          ...s.user,
          name: mock.name,
          email: mock.email,
          role,
          status: 'pending'
        }
      }));
      setSocialLoading(false);
      navigate('scanId');
    }, 1500);
  }

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <BackBtn onBack={() => navigate("welcome")} />
        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <div className="page-title">{isEditingExisting ? "Edit Profile" : "Create Account"}</div>
          <p className="page-subtitle">{isEditingExisting ? "Update your information" : "Enter your details to start renting bikes"}</p>
        </div>
        {[
          ["first", "First Name", "first name"],
          ["middle", "Middle Name", "middle name"],
          ["last", "Last Name", "last name"],
        ].map(([k, label, ph]) => (
          <div key={k} style={{ marginBottom: 14 }}>
            <label className="input-label">{label}</label>
            <input
              className={`input-field ${errors[k] ? "error" : ""}`}
              placeholder={ph}
              value={form[k]}
              onChange={e => update(k, e.target.value)}
            />
            {errors[k] && <span style={{ color: "#FF4D4D", fontSize: 12, marginTop: 4, display: 'block' }}>{errors[k]}</span>}
          </div>
        ))}
        <div style={{ marginBottom: 14 }}>
          <label className="input-label">Email</label>
          <input
            className={`input-field ${errors.email ? "error" : ""}`}
            placeholder="you@example.com"
            value={form.email}
            onChange={e => update("email", e.target.value)}
            type="email"
          />
          {errors.email && <span style={{ color: "#FF4D4D", fontSize: 12, marginTop: 4, display: 'block' }}>{errors.email}</span>}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="input-label">National ID</label>
          <input
            className={`input-field ${errors.nid ? "error" : ""}`}
            placeholder="Enter 14-digit National ID"
            value={form.nid}
            onChange={e => update("nid", e.target.value)}
            maxLength={14}
            type="tel"
          />
          {errors.nid && <span style={{ color: "#FF4D4D", fontSize: 12, marginTop: 4, display: 'block' }}>{errors.nid}</span>}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="input-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PhoneIcon size={18} color="#111" /> Phone Number
            {isEditingExisting && <span style={{ fontSize: 11, color: "#999", marginLeft: 8 }}>(Cannot be changed)</span>}
          </label>
          <input
            className={`input-field ${errors.phone || isDuplicatePhone ? "error" : ""}`}
            placeholder="01234567890"
            value={form.phone}
            onChange={e => update("phone", e.target.value.replace(/\D/g, ''))}
            type="tel"
            maxLength={11}
            disabled={isEditingExisting}
            style={{ opacity: isEditingExisting ? 0.6 : 1, cursor: isEditingExisting ? 'not-allowed' : 'text' }}
          />
          {isEditingExisting && <span style={{ color: "#999", fontSize: 11, marginTop: 4, display: 'block', fontStyle: 'italic' }}>This is your unique account ID and cannot be changed</span>}
          {isDuplicatePhone && <span style={{ color: "#FF4D4D", fontSize: 12, marginTop: 4, display: 'block', display: "flex", alignItems: "center", gap: 4 }}><AlertIcon size={14} /> This phone number is already registered</span>}
          {errors.phone && <span style={{ color: "#FF4D4D", fontSize: 12, marginTop: 4, display: 'block' }}>{errors.phone}</span>}
        </div>

        {showDuplicateToast && (
          <div style={{
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <AlertIcon size={20} color="#ff9800" />
            <div style={{ flex: 1, fontSize: 13 }}>
              <strong>This number is already registered.</strong>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Redirecting to your status page...</div>
            </div>
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label className="input-label">
            Password
            {isEditingExisting && <span style={{ fontSize: 11, color: "#999", marginLeft: 8 }}>(Optional - leave blank to keep current)</span>}
          </label>
          <input
            className={`input-field ${errors.password ? "error" : ""}`}
            placeholder={isEditingExisting ? "Leave blank to keep current password" : "Enter password"}
            value={form.password}
            onChange={e => update("password", e.target.value)}
            type="password"
          />
          {errors.password && <span style={{ color: "#FF4D4D", fontSize: 12, marginTop: 4, display: 'block' }}>{errors.password}</span>}
        </div>
        <div style={{ marginBottom: 24 }}>
          <label className="input-label">
            Confirm Password
            {isEditingExisting && <span style={{ fontSize: 11, color: "#999", marginLeft: 8 }}>(Optional)</span>}
          </label>
          <input
            className={`input-field ${errors.confirm ? "error" : ""}`}
            placeholder={isEditingExisting ? "Confirm new password if changing" : "Enter confirm password"}
            value={form.confirm}
            onChange={e => update("confirm", e.target.value)}
            type="password"
          />
          {errors.confirm && <span style={{ color: "#FF4D4D", fontSize: 12, marginTop: 4, display: 'block' }}>{errors.confirm}</span>}
        </div>
        {!isEditingExisting && (
          <>
            <div className="divider">Or</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              <button
                className="social-btn"
                onClick={() => handleSocial('google')}
                disabled={socialLoading}
                style={{ position: 'relative' }}
              >
                {socialLoading ? (
                  <div className="spinner" style={{ width: 20, height: 20, borderTopColor: DARK, margin: '0 auto' }} />
                ) : (
                  <><span>G</span> Continue with Google</>
                )}
              </button>
              <button
                className="social-btn"
                onClick={() => handleSocial('apple')}
                disabled={socialLoading}
                style={{ position: 'relative' }}
              >
                {socialLoading ? (
                  <div className="spinner" style={{ width: 20, height: 20, borderTopColor: DARK, margin: '0 auto' }} />
                ) : (
                  <><span>A</span> Continue with Apple</>
                )}
              </button>
            </div>
          </>
        )}
        <button
          className="btn-primary"
          onClick={handleRegister}
          disabled={isDuplicatePhone || redirecting}
          style={{ opacity: (isDuplicatePhone || redirecting) ? 0.5 : 1, cursor: (isDuplicatePhone || redirecting) ? 'not-allowed' : 'pointer' }}
        >
          {redirecting ? "Redirecting..." : (isEditingExisting ? "Update Profile" : "Create Account")}
        </button>
      </div>
    </div>
  );
}

function ScanIdScreen({ navigate, state, setState }) {
  const [uploads, setUploads] = useState({ idFront: null, idBack: null, faceScan: null, selfie: null });
  const [currentStep, setCurrentStep] = useState(0);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);

  const steps = [
    { key: 'idFront', label: 'ID Front', icon: '🪪' },
    { key: 'idBack', label: 'ID Back', icon: '🪪' },
    { key: 'faceScan', label: 'Face Scan', icon: '👤' },
    { key: 'selfie', label: 'Selfie', icon: '📱' }
  ];

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [cameraStream]);

  function openCameraForStep(index) {
    setCurrentStep(index);
    setCameraError("");
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(str => {
        setCameraStream(str);
      })
      .catch(err => {
        console.error(err);
        setCameraError("Please allow camera access to verify your ID.");
      });
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    const key = steps[currentStep].key;
    setUploads(u => ({ ...u, [key]: dataUrl }));
    stopCamera();
  }

  const allDone = steps.every(s => uploads[s.key]);

  function handleSubmitVerification() {
    // prepare user object with uploads
    const newUser = {
      email: state.user.email,
      name: state.user.name,
      first: state.user.first,
      last: state.user.last,
      phone: state.user.phone,
      nid: state.user.nid,
      status: 'pending',
      uploads: {
        idFront: uploads.idFront,
        idBack: uploads.idBack,
        faceScan: uploads.faceScan,
        selfie: uploads.selfie
      }
    };

    // save to pending_users array
    try {
      const pending = JSON.parse(localStorage.getItem('pending_users') || '[]');
      pending.push(newUser);
      localStorage.setItem('pending_users', JSON.stringify(pending));
    } catch { }

    // also keep a master users list for tracking status
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
    } catch { }

    // update local state
    setState(s => ({
      ...s,
      user: {
        ...s.user,
        uploads,
        status: 'pending',
        note: ''
      }
    }));
    navigate("scanComplete");
  }

  return (
    <div style={{ minHeight: "100%", background: "white", display: "flex", flexDirection: "column" }}>
      {cameraStream && (
        <div className="camera-overlay">
          <video ref={videoRef} autoPlay playsInline />
          {cameraError && <div className="camera-error">{cameraError}</div>}
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button className="btn-primary" onClick={capturePhoto} style={{ fontSize: 14 }}>✓ Capture</button>
            <button className="btn-primary" style={{ background: '#888', fontSize: 14 }} onClick={stopCamera}>✕ Cancel</button>
          </div>
        </div>
      )}
      <div style={{ padding: "8px 24px", flex: 1, opacity: cameraStream ? 0.3 : 1 }}>
        <BackBtn onBack={() => {
          stopCamera();
          navigate("register");
        }} />
        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <div className="page-title">Verify with 4 Photos</div>
          <p className="page-subtitle">Click each block to capture using your camera</p>
        </div>
        <div className="scan-id-grid" style={{ gap: 12 }}>
          {steps.map((s, i) => (
            <div
              key={s.key}
              className="scan-id-step"
              onClick={() => openCameraForStep(i)}
              style={{
                cursor: "pointer",
                border: currentStep === i && !uploads[s.key] ? `2px solid ${LIME}` : undefined,
                position: 'relative',
                background: uploads[s.key] ? '#e8f5e9' : '#f5f5f5'
              }}
            >
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                {uploads[s.key] ? (
                  <>
                    <img src={uploads[s.key]} alt={s.label} style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 8 }} />
                    <div style={{ position: 'absolute', top: -8, right: -8, background: LIME, color: DARK, borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>✓</div>
                  </>
                ) : (
                  <div style={{ fontSize: 36 }}>{s.icon}</div>
                )}
              </div>
              <span style={{ fontSize: 12, textAlign: "center", fontWeight: uploads[s.key] ? 600 : 500, color: uploads[s.key] ? '#2e7d32' : '#666' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 24px 32px", background: "white" }}>
        <button
          className="btn-primary"
          style={{ width: "100%", background: allDone ? LIME : "#ccc", cursor: allDone ? 'pointer' : 'not-allowed' }}
          disabled={!allDone}
          onClick={handleSubmitVerification}
        >
          {allDone ? '✓ Submit All Photos' : `${Object.values(uploads).filter(Boolean).length}/4 Complete`}
        </button>
      </div>
    </div>
  );
}

function ScanCompleteScreen({ navigate }) {
  useEffect(() => { const t = setTimeout(() => navigate("statusDashboard"), 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "white", padding: 32 }}>
      <div className="success-circle">✓</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", textAlign: "center" }}>Scan Complete!</h2>
      <p style={{ color: "#888", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>Your ID details have been captured.</p>
      <div style={{ marginTop: 40, width: "100%" }}>
        <button className="btn-primary" onClick={() => navigate("statusDashboard")}>Continue</button>
      </div>
    </div>
  );
}

function StatusDashboardScreen({ navigate, state, setState }) {
  const progressSteps = [
    { label: "Phone Verified", completed: true },
    { label: "Documents Uploaded", completed: true },
    { label: "Admin Review", completed: false, inProgress: true }
  ];

  function handleLogout() {
    localStorage.removeItem('bike_app_user');
    setState(s => ({ ...s, user: { name: "", email: "", profilePic: "", role: "", phone: "", first: "", last: "", status: null } }));
    navigate('welcome');
  }

  function handleEditProfile() {
    // Save the latest user data to localStorage so RegisterScreen can read it
    const userDataToSave = {
      ...state.user,
      first: state.user.first || '',
      middle: state.user.middle || '',
      last: state.user.last || '',
      email: state.user.email || '',
      nid: state.user.nid || '',
      // Flag tells RegisterScreen to skip the 'pending → redirect' guard
      isEditingProfile: true,
    };
    localStorage.setItem('bike_app_user', JSON.stringify(userDataToSave));
    // Also update state so RegisterScreen receives the flag
    setState(s => ({ ...s, user: userDataToSave }));
    navigate('register');
  }

  return (
    <div style={{ minHeight: "100%", background: "white", display: "flex", flexDirection: "column", padding: "20px 24px 24px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Verification Status</h2>
      <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>Your account is being reviewed</p>

      {state.user?.isReturningPendingUser && (
        <div style={{
          background: "#e3f2fd",
          border: "1px solid #90caf9",
          borderRadius: 8,
          padding: 12,
          marginBottom: 24
        }}>
          <div style={{ color: "#1976d2", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
            {/* custom bike image replaces previous emoji */}
            <img src="/images/bike.png" alt="Bike" style={{ width: 18, height: 18 }} />
            Welcome back!
          </div>
          <p style={{ color: "#555", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
            Your account is still being reviewed by our team. We'll notify you as soon as it's approved.
          </p>
        </div>
      )}

      {state.user.note && (
        <div style={{ background: "#fff3cd", padding: 12, borderRadius: 8, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, color: "#ff6b35", fontSize: 13, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            Note from Admin
          </div>
          <div style={{ color: "#555", fontSize: 12, lineHeight: 1.5 }}>
            {state.user.note}
          </div>
          <div style={{ color: "#888", fontSize: 11, marginTop: 8, fontStyle: "italic" }}>
            Please review the suggested corrections below and re-submit.
          </div>
        </div>
      )}

      <div style={{ background: "#f8f8f8", borderRadius: 16, padding: 20, marginBottom: 24 }}>
        {progressSteps.map((step, idx) => (
          <div key={idx} style={{ marginBottom: idx < progressSteps.length - 1 ? 20 : 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: step.completed ? LIME : step.inProgress ? "#fff3cd" : "#e8e8e8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: 700,
                color: step.completed ? DARK : step.inProgress ? "#ff9800" : "#ccc",
                fontSize: 16
              }}>
                {step.completed ? <CheckIcon size={18} color={DARK} /> : step.inProgress ? "•" : ""}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: DARK, marginBottom: 4 }}>{step.label}</div>
                {step.inProgress && <div style={{ fontSize: 12, color: "#ff9800" }}>In progress...</div>}
              </div>
            </div>
            {idx < progressSteps.length - 1 && <div style={{ marginLeft: 16, marginTop: 12, height: 24, borderLeft: "2px solid #e8e8e8" }} />}
          </div>
        ))}
      </div>

      <div style={{ background: "#f0f8e0", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
          ⏱ <strong>Expected wait time:</strong> Usually 24 hours<br />
          We'll notify you via email once your account is approved.
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {state.user.note && (
          <button className="btn-primary" onClick={() => navigate('scanId')} style={{ width: "100%" }}>
            Re-upload ID
          </button>
        )}
        <button className="btn-primary" onClick={handleEditProfile} style={{ width: "100%" }}>
          Edit Profile Info
        </button>
        <button className="btn-secondary" onClick={handleLogout} style={{ width: "100%" }}>Logout</button>
      </div>
    </div>
  );
}

function PendingApprovalScreen({ navigate, state }) {
  const illustrationUrl = "https://raw.githubusercontent.com/Almousa-Dev/Smart-Bike-Assets/main/verification_pending.png";
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "white", padding: 32 }}>
      <img src={illustrationUrl} alt="Verification Pending" style={{ width: 120, height: 120, marginBottom: 32, opacity: 0.7 }} onError={(e) => { e.target.style.display = "none"; }} />
      <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", textAlign: "center", marginBottom: 12 }}>Verification in Progress</h2>
      <div style={{ fontSize: 48, marginBottom: 32 }}>⏳</div>
      <p style={{ color: "#666", textAlign: "center", lineHeight: 1.6, maxWidth: 280, marginBottom: 48 }}>Our team is reviewing your documents. You will be notified once your account is active.</p>
      <button className="btn-primary" onClick={() => navigate("statusDashboard")} style={{ width: "100%" }}>Check Status</button>
    </div>
  );
}

const BIKES = [
  { x: "12%", y: "28%", id: "A24", range: "120 M", walk: "2 Min", rate: "0.5 EGP / Min, 20 /Hour" },
  { x: "42%", y: "36%", id: "B04", range: "80 M", walk: "1 Min", rate: "0.5 EGP / Min, 20 /Hour" },
  { x: "22%", y: "52%", id: "C12", range: "200 M", walk: "3 Min", rate: "0.6 EGP / Min, 22 /Hour" },
  { x: "50%", y: "62%", id: "D07", range: "150 M", walk: "2 Min", rate: "0.5 EGP / Min, 20 /Hour" },
  { x: "18%", y: "72%", id: "E03", range: "300 M", walk: "4 Min", rate: "0.4 EGP / Min, 18 /Hour" },
];

function MapScreen({ navigate, state, setState }) {
  const [selectedBike, setSelectedBike] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const btnBoxStyle = { width: 44, height: 44, borderRadius: 12, background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" };

  useEffect(() => {
    if (state.user?.status && state.user.status !== 'approved') {
      navigate('statusDashboard');
    }
  }, [state.user?.status, navigate]);

  // Derive bikes from hardware — use real Damietta lat/lng
  const hardware = (() => {
    try { return JSON.parse(localStorage.getItem('bike_hardware')); } catch { return null; }
  })();
  const bikesArr = hardware && hardware.health !== 'faulty' ? [
    { lat: 31.4175, lng: 31.8144, id: hardware.id, battery: `${hardware.battery}%`, status: hardware.locked ? 'Locked' : 'Unlocked', rate: '' }
  ] : [];

  const displayBikes = bikesArr.length > 0 ? bikesArr : DAMIETTA_BIKES;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Real Leaflet Map */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", zIndex: 0 }}>
        <LeafletMap bikes={displayBikes} onBikeClick={i => setSelectedBike(i)} selectedBike={selectedBike} />
      </div>

      {/* Top bar: Menu + Bell */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", justifyContent: "space-between", padding: "14px 16px 8px" }}>
        <button style={btnBoxStyle} onClick={() => setShowDrawer(true)} aria-label="Open menu">
          <MenuIcon size={20} />
        </button>
        <button style={{ ...btnBoxStyle, position: "relative" }} onClick={() => navigate("notifications")} aria-label="Notifications">
          <BellIcon size={20} />
          <span style={{ position: "absolute", top: 6, right: 6, width: 16, height: 16, background: "#FF3B30", borderRadius: "50%", fontSize: 9, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>4</span>
        </button>
      </div>

      {/* Right-side FABs */}
      <div style={{ position: "absolute", bottom: 90, right: 16, zIndex: 10, display: "flex", flexDirection: "column", gap: 10 }}>
        <button style={btnBoxStyle} aria-label="My location">
          <LocationIcon size={20} />
        </button>
        <button style={btnBoxStyle} aria-label="Refresh map">
          <RefreshIcon size={20} />
        </button>
      </div>

      {/* Left-side FAB */}
      <div style={{ position: "absolute", bottom: 90, left: 16, zIndex: 10 }}>
        <button style={btnBoxStyle} aria-label="Support">
          <HeadsetIcon size={20} />
        </button>
      </div>

      {/* Bottom CTA */}
      {selectedBike === null ? (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 32px", zIndex: 10 }}>
          <button className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }} onClick={() => navigate("scanQR")}>
            <QRScanIcon size={18} color={DARK} /> Scan To Ride
          </button>
        </div>
      ) : (
        <div className="bottom-sheet" style={{ zIndex: 10 }}>
          <div className="sheet-handle" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Space Grotesk',sans-serif" }}>Bike #{displayBikes[selectedBike]?.id || ''}</div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ color: "#888", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <BatteryIconSVG size={16} color="#888" /> {displayBikes[selectedBike]?.battery} battery
                </span>
                <span style={{ color: "#888", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <PadlockIcon size={16} color="#888" /> {displayBikes[selectedBike]?.status || ''}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ width: 52, height: 52, background: "#f5f5f5", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BikeIconSVG size={36} color={DARK} />
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 20 }} onClick={() => setSelectedBike(null)}>✕</button>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => navigate("scanQR")}>
              <QRScanIcon size={18} color={DARK} /> Scan To Unlock
            </button>
            <button className="btn-outline" onClick={() => { setState(s => ({ ...s, selectedBike: BIKES[selectedBike] })); navigate("reserve"); }}>Reserve</button>
          </div>
        </div>
      )}

      {/* Side Drawer */}
      {showDrawer && (
        <div className="drawer-overlay">
          <div className="drawer-bg" onClick={() => setShowDrawer(false)} />
          <div className="drawer">
            <div style={{ background: LIME, padding: "60px 20px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="profile-img" style={{ background: "#fff", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", overflow: "hidden" }}>
                  {state.user.profilePic ? (
                    <img src={state.user.profilePic} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: 64, height: 64, background: DARK, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <UserSettingsIcon size={28} color="white" />
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, fontFamily: "'Space Grotesk',sans-serif" }}>{state.user.name || 'Guest User'}</div>
                  {state.user.email && <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{state.user.email}</div>}
                </div>
              </div>
              <button className="btn-outline" style={{ marginTop: 16, background: "white", borderColor: DARK }} onClick={() => { setShowDrawer(false); navigate("profile"); }}>View Profile</button>
            </div>
            <div style={{ padding: "16px 0" }}>
              {(() => {
                const items = [
                  { icon: <BikeIconSVG size={20} color={DARK} />, label: "Rides History", screen: "history" },
                  { icon: <LocationIcon size={20} color={DARK} />, label: "How To Ride?", screen: "howToRide" },
                  { icon: <UserSettingsIcon size={20} color={DARK} />, label: "Settings", screen: "settings" },
                  { icon: <AlertIcon size={20} color="#FF9800" />, label: "Report Issue", screen: "reportIssue" },
                ];
                if (state.user.role === 'admin') {
                  items.unshift({ icon: <UserSettingsIcon size={20} color={DARK} />, label: 'Admin Dashboard', screen: 'admin' });
                }
                return items.map(item => (
                  <button
                    key={item.label}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: DARK, transition: "background 0.15s" }}
                    onClick={() => { setShowDrawer(false); navigate(item.screen); }}
                  >
                    {item.icon} {item.label}
                  </button>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function ReserveScreen({ navigate, state }) {
  const [selected, setSelected] = useState("15");
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);

  useEffect(() => {
    if (state.user?.status && state.user.status !== 'approved') {
      navigate('statusDashboard');
    }
  }, [state.user?.status, navigate]);

  const prices = { "15": 9, "30": 18, "60": 36 };
  const price = selected === "custom" ? ((hours * 60 + mins) * 0.6).toFixed(2) : prices[selected];

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("map")} />
          <div className="page-title">Reserve For Duration</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, background: LIME, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🚲</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk',sans-serif" }}>
              Bike {state.selectedBike?.id ? `B${state.selectedBike.id}` : "B004"}
            </div>
            <div style={{ color: "#888", fontSize: 13 }}>Regular Bike</div>
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12 }}>Quick Select</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {["15", "30", "60"].map(v => (
            <button key={v} className={`quick-select-btn ${selected === v ? "selected" : ""}`} onClick={() => setSelected(v)}>
              {v === "60" ? "1 hour" : `${v} min`}
            </button>
          ))}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 16 }}>Custom Duration</div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 24 }}>
          {[{ val: hours, set: setHours, label: "hours" }, { val: mins, set: setMins, label: "min" }].map(({ val, set, label }, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <button className="counter-btn" onClick={() => { set(v => v + 1); setSelected("custom"); }}>+</button>
              <div className="counter-val">{val}</div>
              <button className="counter-btn" onClick={() => set(v => Math.max(0, v - 1))}>−</button>
              <span style={{ color: "#888", fontSize: 13, fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "#888", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Estimated Price</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>
            {price} <span style={{ fontSize: 16, fontWeight: 600, color: "#888" }}>EGP</span>
          </div>
          <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
            ⓘ For {selected === "custom" ? `${hours}h ${mins}m` : `${selected} minutes`} . 0.6 EGP/min
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate("reserved")}>Reserve</button>
      </div>
    </div>
  );
}

function ReservedScreen({ navigate }) {
  useEffect(() => { const t = setTimeout(() => navigate("bikeFound"), 2500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "white", padding: 32 }}>
      <div className="success-circle">✓</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", textAlign: "center" }}>Bike Reserved!</h2>
      <p style={{ color: "#888", textAlign: "center", marginTop: 10 }}>Your bike is reserved for 10 minutes</p>
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, color: "#888", fontSize: 14 }}>
        <span>🕐</span> Please reach the bike within 10 minutes
      </div>
    </div>
  );
}

function BikeFoundScreen({ navigate }) {
  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div style={{ height: "45%" }}>
        <FakeMap bikes={BIKES.slice(0, 2)} />
      </div>
      <div style={{ position: "absolute", top: "36%", left: 0, right: 0, padding: "0 20px" }}>
        <div style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 -4px 24px rgba(0,0,0,0.12)" }}>
          <BackBtn onBack={() => navigate("map")} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 20px" }}>
            <div style={{ width: 64, height: 64, background: "#e8ffc0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>Bike Found!</div>
            <div style={{ color: "#888", fontSize: 14, marginTop: 4 }}>Ready to ride.</div>
          </div>
          <div style={{ border: "2px solid #e8e8e8", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>🚲</span>
            <div>
              <div style={{ fontWeight: 700 }}>Bike #2847</div>
              <div style={{ color: "#888", fontSize: 13 }}>📍 2 Meters Away</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => navigate("scanQR")}>⊡ Scan To Unlock</button>
            <button className="btn-outline" onClick={() => navigate("map")}>🗺️ Back To Map</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanQRScreen({ navigate, state }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [scannedCode, setScannedCode] = useState(null);

  const bikeId = state.selectedBike?.id || 'BIKE-001';

  useEffect(() => {
    if (state.user?.status && state.user.status !== 'approved') {
      navigate('statusDashboard');
    }
  }, [state.user?.status, navigate]);

  // Initialize camera
  useEffect(() => {
    if (!scanning) return;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Camera error:', err);
        setError('Camera access denied');
        setScanning(false);
      });

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [scanning]);

  // Scan for QR code
  useEffect(() => {
    if (!scanning || !videoRef.current) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!canvas || !video || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Simple QR detection: look for dark/light patterns
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let darkCount = 0;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] + data[i + 1] + data[i + 2];
        if (gray < 384) darkCount++;
      }
      const darkRatio = darkCount / (canvas.width * canvas.height);

      // If significant dark pattern detected (typical QR ratio), verify code
      if (darkRatio > 0.2 && darkRatio < 0.8) {
        // Simulate QR decode: in real app, use qrcode.js or similar
        const simulated = `QR-${bikeId}`;
        if (simulated) {
          handleQRDetected(simulated);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [scanning, bikeId]);

  function handleQRDetected(code) {
    // Play beep sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }

    setScannedCode(code);
    setScanning(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }

    // Verify QR matches bike ID
    if (code.includes(bikeId) || code === `QR-${bikeId}`) {
      setTimeout(() => {
        navigate('riding');
      }, 1500);
    } else {
      setError('Invalid QR Code. Please try again.');
      setScannedCode(null);
    }
  }

  return (
    <div style={{ height: "100%", background: "#000" }}>
      {scanning && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)" }} />
        </>
      )}
      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          style={{ width: 40, height: 40, background: "white", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => {
            if (scanning && cameraStream) {
              cameraStream.getTracks().forEach(t => t.stop());
              setCameraStream(null);
            }
            setScanning(false);
            navigate("map");
          }}
        >
          ←
        </button>
        <span style={{ color: "white", fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", fontSize: 16 }}>Scan QR Code</span>
        <div style={{ width: 40 }} />
      </div>

      {/* QR Scanner Overlay */}
      {scanning && (
        <div className="qr-scanner-overlay">
          <div className="qr-frame">
            <div className="qr-corner tl" />
            <div className="qr-corner tr" />
            <div className="qr-corner bl" />
            <div className="qr-corner br" />
            <div className="scan-line" />
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 32, textAlign: "center", position: "absolute", bottom: 140 }}>Position QR code within the frame</p>
        </div>
      )}

      {/* Status Messages */}
      {scannedCode && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", borderRadius: 16, padding: 24, textAlign: "center", zIndex: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>QR Code Verified!</div>
          <p style={{ color: "#888", fontSize: 14 }}>Unlocking bike...</p>
        </div>
      )}

      {error && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", borderRadius: 16, padding: 24, textAlign: "center", zIndex: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#x26a0;</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#f44336" }}>{error}</div>
          <button
            onClick={() => {
              setError("");
              setScanning(false);
            }}
            style={{ background: "#f44336", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", marginTop: 12 }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Bottom Controls */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {!scanning && !scannedCode && (
          <>
            <button className="btn-primary" onClick={() => { setScanning(true); setError(""); }} style={{ color: DARK }}>
              {scanning ? "🔍 Scanning..." : "Start Scanning"}
            </button>
            <button className="btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }} onClick={() => navigate("map")}>
              ← Back To Map
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function RidingScreen({ navigate, state }) {
  const [showEmergency, setShowEmergency] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showPaused, setShowPaused] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3580);

  useEffect(() => {
    if (state.user?.status && state.user.status !== 'approved') {
      navigate('statusDashboard');
    }
  }, [state.user?.status, navigate]);

  useEffect(() => {
    if (showPaused) return;
    const t = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [showPaused]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div style={{ height: "100%" }}>
        <FakeMap bikes={[]} />
      </div>
      <div style={{ position: "absolute", top: 14, left: 0, right: 0, padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <button style={{ width: 40, height: 40, borderRadius: 12, background: "white", border: "none", cursor: "pointer", fontSize: 18 }}>☰</button>
        <div style={{ background: LIME, borderRadius: 50, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>
          <span style={{ width: 8, height: 8, background: DARK, borderRadius: "50%", display: "inline-block" }} />
          Ride in Progress
        </div>
      </div>
      <div style={{ position: "absolute", top: 80, left: 16, right: 16, background: "white", borderRadius: 20, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 10 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#888", fontSize: 12, fontWeight: 600 }}>Time Left</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: timeLeft < 300 ? "#FF3B30" : DARK }}>{fmt(timeLeft)}</div>
          </div>
          <div style={{ width: 1, background: "#eee" }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: "#888", fontSize: 12, fontWeight: 600 }}>Distance</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>340m</div>
          </div>
        </div>
        <div className="ride-progress-bar">
          <div className="ride-progress-fill" style={{ width: `${((3600 - timeLeft) / 3600) * 100}%` }} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "120px", left: 16, zIndex: 10 }}>
        <button className="emergency-btn" onClick={() => setShowShare(true)}>📤</button>
      </div>
      <div style={{ position: "absolute", bottom: "120px", right: 16, zIndex: 10 }}>
        <button className="emergency-btn" onClick={() => setShowEmergency(true)}>⚠️</button>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 32px", display: "flex", flexDirection: "column", gap: 10, zIndex: 10 }}>
        <button className="btn-danger" onClick={() => setShowEndConfirm(true)}>End Ride</button>
        <button className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "white" }} onClick={() => setShowPaused(true)}>
          🔒 Pause & Lock
        </button>
      </div>

      {showEmergency && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card" style={{ margin: "0 24px" }}>
            <div style={{ textAlign: "center", paddingBottom: 8 }}>
              <div style={{ width: 60, height: 60, background: "#fff0c0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>⚠️</div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Emergency SOS</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Get help immediately</p>
              <button className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }} onClick={() => { setShowEmergency(false); navigate("calling"); }}>
                📞 Call Emergency Services
              </button>
              <button className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => setShowEmergency(false)}>
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEndConfirm && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, background: "#ffe0e0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>🚪</div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>End ride?</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Your ride will stop and charges will be finalized.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button style={{ flex: 1, padding: "14px", background: "#FF3B30", color: "white", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", fontSize: 15 }} onClick={() => { setShowEndConfirm(false); navigate("verifyLock"); }}>Confirm</button>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowEndConfirm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaused && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, background: "#e8ffc0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>⏸</div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Ride Paused</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Your ride is temporarily on hold</p>
              <button className="btn-primary" onClick={() => setShowPaused(false)}>Continue Ride</button>
            </div>
          </div>
        </div>
      )}

      {showShare && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="sheet-handle" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div className="page-title" style={{ fontSize: 20 }}>Share Your Ride</div>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#888" }} onClick={() => setShowShare(false)}>✕</button>
            </div>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Choose how you want to share your location</p>
            <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: "#f0f0f0", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📤</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Share Ride Location</div>
                  <div style={{ color: "#888", fontSize: 12 }}>Send your live ride location to friends</div>
                </div>
              </div>
              <span style={{ color: "#aaa" }}>›</span>
            </div>
            <div style={{ background: "#f5fde0", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <span style={{ fontSize: 12, color: "#666" }}>Your privacy matters. you control who sees your location and when.</span>
            </div>
            <div style={{ background: "#f0f0f0", borderRadius: 12, padding: 14, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Sharing live ride location</div>
              <div style={{ color: "#888", fontSize: 12 }}>Damietta, Egypt</div>
            </div>
            <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>SHARE VIA</div>
            <div className="share-apps">
              {[["💬", "#25D366", "WhatsApp"], ["💬", "#34aadc", "Messages"], ["💜", "#a259ff", "Messenger"], ["⋯", "#e0e0e0", "More"]].map(([icon, bg, name]) => (
                <div key={name} className="share-app" onClick={() => setShowShare(false)}>
                  <div className="share-app-icon" style={{ background: bg }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                  </div>
                  <span className="share-app-name">{name}</span>
                </div>
              ))}
            </div>
            {[["📸", "Instagram Stories"], ["𝕏", "Twitter / X"], ["🔗", "Copy Link"]].map(([icon, label]) => (
              <div key={label} className="share-option" onClick={() => setShowShare(false)}>
                <div style={{ width: 44, height: 44, background: "#f0f0f0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CallingScreen({ navigate }) {
  return (
    <div style={{ background: "#2a2a2a", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <BackBtn onBack={() => navigate("riding")} light />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "white", fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 40 }}>Emergency Services</div>
        <div style={{ width: 120, height: 120, background: LIME, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, marginBottom: 24, animation: "popIn 0.5s" }}>🎧</div>
        <div style={{ color: "white", fontSize: 18, fontWeight: 600, letterSpacing: 2, animation: "pulse 1.5s infinite" }}>CALLING....</div>
      </div>
      <div style={{ display: "flex", gap: 60, marginBottom: 40 }}>
        <button className="call-btn" style={{ background: "white" }}>📞</button>
        <button className="call-btn" style={{ background: "#FF3B30" }} onClick={() => navigate("riding")}>📵</button>
      </div>
    </div>
  );
}

function VerifyLockScreen({ navigate }) {
  const [taken, setTaken] = useState(false);
  const [status, setStatus] = useState(null);

  function handlePhoto() {
    setTaken(true);
    setTimeout(() => {
      setStatus(Math.random() > 0.5 ? "verified" : "warning");
    }, 1000);
  }

  return (
    <div style={{ height: "100%", background: "#111", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button style={{ width: 40, height: 40, background: "white", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => navigate("riding")}>←</button>
        <span style={{ color: "white", fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>Verify Bike Lock</span>
        <button style={{ width: 40, height: 40, background: "white", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>🔦</button>
      </div>
      <div style={{ height: "55%", background: taken ? "linear-gradient(135deg, #c0a080 0%, #908060 100%)" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: taken ? 80 : 40 }}>
        {taken ? "🚲" : "📷"}
      </div>
      <div className="qr-frame" style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)" }}>
        <div className="qr-corner tl" />
        <div className="qr-corner tr" />
        <div className="qr-corner bl" />
        <div className="qr-corner br" />
      </div>
      {!status && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 40px", display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ color: "white", textAlign: "center", fontSize: 14, marginBottom: 8 }}>Take a photo of your locked bike</p>
          <button className="btn-primary" onClick={handlePhoto}>Take photo</button>
          <button className="btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>⚠️ Need Help?</button>
        </div>
      )}
      {status === "warning" && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, background: "#fff0c0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>⚠️</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Warning: Your bike is unlocked!</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Your bike is not secured. please lock it!</p>
              <button className="btn-primary" onClick={() => { setStatus(null); setTaken(false); }}>Retake photo</button>
            </div>
          </div>
        </div>
      )}
      {status === "verified" && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, background: "#e8ffc0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>✓</div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Bike Lock Verified</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Your bike is safely locked</p>
              <button className="btn-primary" onClick={() => navigate("rideComplete")}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RideCompleteScreen({ navigate }) {
  const [checked, setChecked] = useState(true);
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
          <div className="success-circle">✓</div>
          <div className="page-title" style={{ fontSize: 26 }}>Ride Completed!</div>
          <p className="page-subtitle">Here's your ride summary</p>
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12 }}>Ride Summary</div>
          {[["Bike", "City Cruiser"], ["Planned Duration", "60min"], ["Actual Duration", "60min"], ["Rate", "15EGP/hour"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#888", fontSize: 14 }}>{k}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>Total Cost</span>
            <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Space Grotesk',sans-serif" }}>15 EGP</span>
          </div>
          <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Charged to ....4242</div>
        </div>
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 24 }}
          onClick={() => setChecked(!checked)}
        >
          <div style={{ width: 28, height: 28, border: `2px solid ${checked ? DARK : "#ddd"}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: checked ? DARK : "white", flexShrink: 0 }}>
            {checked && <span style={{ color: "white", fontSize: 16 }}>✓</span>}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>The bike is in good condition</div>
            <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>Please confirm that the bike has no damage and is properly parked</div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate("payment")}>Proceed To Payment</button>
      </div>
    </div>
  );
}

function PaymentScreen({ navigate }) {
  const [selected, setSelected] = useState("wallet");
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("rideComplete")} />
          <div className="page-title">Payment</div>
        </div>
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12 }}>Rental Summary</div>
          {[["Bike", "City Cruiser"], ["Planned Duration", "60min"], ["Actual Duration", "60min"], ["Rate", "15EGP/hour"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#888", fontSize: 14 }}>{k}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e8e8e8", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700 }}>Total</span>
            <span style={{ fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>15 EGP</span>
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>Payment Method</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {[
            { id: "wallet", icon: "💳", title: "Digital Wallet", sub: "400.50 available" },
            { id: "card", icon: "💳", title: "Credit Card", sub: "......4242" },
          ].map(m => (
            <div key={m.id} className={`payment-method-item ${selected === m.id ? "selected" : ""}`} onClick={() => setSelected(m.id)}>
              <div style={{ width: 40, height: 40, background: "#f0f0f0", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{m.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.title}</div>
                <div style={{ color: "#888", fontSize: 12 }}>{m.sub}</div>
              </div>
              <div className={`radio-circle ${selected === m.id ? "selected" : ""}`} />
            </div>
          ))}
          <button className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => navigate("paymentMethod")}>
            + Add New Payment Method
          </button>
        </div>
        <button className="btn-primary" onClick={() => navigate("paymentSuccess")}>Continue To Payment</button>
      </div>
    </div>
  );
}

function PaymentMethodScreen({ navigate }) {
  const [selected, setSelected] = useState(null);
  const methods = [
    { id: "apple", logo: "🍎 Pay", name: "Apple Pay", sub: "Fast & Secure" },
    { id: "fawry", logo: "fawry", name: "Fawry", sub: "Fast & Secure" },
  ];
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("payment")} />
          <div className="page-title">Payment Method</div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>Digital Wallets</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {methods.map(m => (
            <div key={m.id} className={`payment-method-item ${selected === m.id ? "selected" : ""}`} onClick={() => setSelected(m.id)}>
              <div style={{ width: 52, height: 36, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{m.logo}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                <div style={{ color: "#888", fontSize: 12 }}>{m.sub}</div>
              </div>
              <div className={`radio-circle ${selected === m.id ? "selected" : ""}`} />
            </div>
          ))}
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 14 }}>Saved Cards</div>
        <div className={`payment-method-item ${selected === "mc" ? "selected" : ""}`} style={{ marginBottom: 16 }} onClick={() => setSelected("mc")}>
          <div style={{ display: "flex", gap: -8 }}>
            <div style={{ width: 26, height: 26, background: "#EB001B", borderRadius: "50%" }} />
            <div style={{ width: 26, height: 26, background: "#F79E1B", borderRadius: "50%", marginLeft: -12 }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Mastercard</div>
            <div style={{ color: "#888", fontSize: 12 }}>****3956</div>
          </div>
          <div className={`radio-circle ${selected === "mc" ? "selected" : ""}`} />
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: DARK, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontFamily: "'Space Grotesk',sans-serif" }}>
          + Add New Card
        </button>
        <button className="btn-primary" onClick={() => navigate("paymentSuccess")}>Pay Now</button>
      </div>
    </div>
  );
}

function PaymentSuccessScreen({ navigate }) {
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 20 }}>Confirm Payment</div>
          <div style={{ width: 72, height: 72, background: "#f0f0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px", animation: "popIn 0.4s" }}>✓</div>
          <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>Payment Successful!</div>
          <p style={{ color: "#888", marginTop: 8 }}>Thank you for your ride</p>
        </div>
        <div className="card" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Receipt</span>
            <span style={{ color: "#888", fontSize: 14 }}>Dec 8, 2025</span>
          </div>
          {[["Transaction ID", "#BK45782"], ["Duration", "45 minutes"], ["Distance", "5.2 Km"], ["Rate", "15 EGP/hour"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#888", fontSize: 14 }}>{k}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e8e8e8", marginTop: 10, paddingTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700 }}>Total paid</span>
              <span style={{ fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>15 EGP</span>
            </div>
            <div style={{ color: "#888", fontSize: 13, textAlign: "right", marginTop: 4 }}>****4242</div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate("map")}>Back To Home</button>
      </div>
    </div>
  );
}

function HistoryScreen({ navigate }) {
  const rides = [
    { status: "Completed", date: "Dec 5 - 2025", time: "3:45 PM", from: "Maadi - Street 9", to: "New Cairo- Downtown...", amount: "EGP 22.50" },
    { status: "Canceled", date: "Dec 5 - 2025", time: "3:45 PM", from: "Maadi - Street 9", to: "New Cairo- Downtown...", amount: "EGP 22.50" },
    { status: "Completed", date: "Dec 4 - 2025", time: "11:20 AM", from: "Maadi - Street 9", to: "New Cairo- Downtown...", amount: "EGP 15.00" },
    { status: "Canceled", date: "Dec 3 - 2025", time: "8:00 PM", from: "Maadi - Street 9", to: "New Cairo- Downtown...", amount: "EGP 22.50" },
  ];

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("map")} />
          <div className="page-title">Ride History</div>
        </div>
        {rides.map((r, i) => (
          <div key={i} className="history-card">
            <span className={`status-badge ${r.status === "Completed" ? "badge-completed" : "badge-canceled"}`}>{r.status}</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>{r.date}<br />{r.time}</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 2 }}>
                    <div style={{ width: 10, height: 10, background: DARK, borderRadius: "50%" }} />
                    <div style={{ width: 1.5, height: 20, background: "#aaa", margin: "3px 0" }} />
                    <div style={{ width: 10, height: 10, background: "#888", borderRadius: "50%", border: "2px solid #aaa" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.from}</div>
                    <div style={{ color: "#888", fontSize: 13, marginTop: 16 }}>{r.to}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #ebebeb", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>{r.amount}</span>
              <span style={{ color: "#aaa" }}>›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HowToRideScreen({ navigate }) {
  const steps = [
    { icon: "🗺️", num: 1, title: "Find a Nearby Bike", desc: "Open the map and choose the closest available bike." },
    { icon: "📱", num: 2, title: "Unlock Instantly", desc: "Scan the QR code or tap NFC to unlock." },
    { icon: "🚲", num: 3, title: "Ride Freely", desc: "Ride safely. pause and lock anytime without ending your trip." },
  ];
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("map")} />
          <div className="page-title">How To Ride?</div>
        </div>
        {steps.map(s => (
          <div key={s.num} className="how-to-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div className="step-number">{s.num}</div>
              <div style={{ fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>{s.title}</div>
            </div>
            <div style={{ background: "#eef8e0", borderRadius: 16, height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, marginBottom: 10 }}>{s.icon}</div>
            <p style={{ color: "#888", fontSize: 14, lineHeight: 1.5 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsScreen({ navigate }) {
  const notifs = [
    { icon: "📅", title: null, body: "Festive ride suggestion check out the christmas lights at downtown park - perfect a co..........", time: "10m ago", unread: false },
    { icon: "🚲", title: "Ride Complete!", body: "Great job! you rode 5.2 km in 23 minutes", time: "5m ago", unread: true },
    { icon: "📅", title: null, body: "Festive ride suggestion check out the christmas lights at downtown park - perfect a co..........", time: "10m ago", unread: false },
    { icon: "🚲", title: "Ride Complete!", body: "Great job! you rode 5.2 km in 23 minutes", time: "5m ago", unread: true },
    { icon: "📅", title: null, body: "Festive ride suggestion check out the christmas lights at downtown park - perfect a co..........", time: "10m ago", unread: false },
    { icon: "🚲", title: "Ride Complete!", body: "Great job! you rode 5.2 km in 23 minutes", time: "5m ago", unread: true },
  ];
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <BackBtn onBack={() => navigate("map")} />
          <div className="page-title">Notifications</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: "#555" }}>4 unread</span>
          <span style={{ color: LIME, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>Mark all as read</span>
        </div>
        {notifs.map((n, i) => (
          <div key={i} style={{ background: "#f7f7f7", borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", gap: 12, position: "relative" }}>
            <div style={{ width: 40, height: 40, background: "#e8e8e8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              {n.title && <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{n.title}</div>}
              <div style={{ color: n.title ? "#888" : "#555", fontSize: 13, lineHeight: 1.4 }}>{n.body}</div>
              <div style={{ color: "#aaa", fontSize: 12, marginTop: 6 }}>{n.time}</div>
            </div>
            {n.unread && <span className="notification-dot" style={{ position: "absolute", top: 16, right: 16 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ navigate }) {
  const [notifs, setNotifs] = useState(false);
  const [dark, setDark] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [lang, setLang] = useState("English");
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("map")} />
          <div className="page-title">Settings</div>
        </div>
        <div className="settings-group" style={{ marginBottom: 16 }}>
          <div className="settings-item">
            <span style={{ fontSize: 20 }}>🔔</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>Notifications</span>
            <div className={`toggle ${notifs ? "on" : ""}`} onClick={() => setNotifs(!notifs)} />
          </div>
          <div className="settings-item">
            <span style={{ fontSize: 20 }}>🌙</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>Dark Mode</span>
            <div className={`toggle ${dark ? "on" : ""}`} onClick={() => setDark(!dark)} />
          </div>
          <div className="settings-item" onClick={() => setShowLang(true)}>
            <span style={{ fontSize: 20 }}>🌐</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>Language</span>
            <span style={{ color: "#888", fontSize: 14, marginRight: 8 }}>{lang}</span>
            <span style={{ color: "#aaa" }}>›</span>
          </div>
        </div>
        <div className="settings-group" style={{ marginBottom: 32 }}>
          <div className="settings-item" onClick={() => navigate("legal")}>
            <span style={{ fontSize: 20 }}>❓</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>Support</span>
            <span style={{ color: "#aaa" }}>›</span>
          </div>
          <div className="settings-item" onClick={() => navigate("legal")}>
            <span style={{ fontSize: 20 }}>🛡️</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>Privacy & Terms</span>
            <span style={{ color: "#aaa" }}>›</span>
          </div>
          <div className="settings-item" onClick={() => setShowLogout(true)}>
            <span style={{ fontSize: 20 }}>🚪</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>Log Out</span>
            <span style={{ color: "#aaa" }}>›</span>
          </div>
        </div>
        <button style={{ width: "100%", padding: "16px", background: "transparent", color: "#FF3B30", border: "2px solid #FF3B30", borderRadius: 50, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", fontSize: 15 }}>
          Delete Account
        </button>
      </div>

      {showLang && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="sheet-handle" />
            {["English", "Arabic"].map(l => (
              <div key={l} className={`payment-method-item ${lang === l ? "selected" : ""}`} style={{ marginBottom: 10 }} onClick={() => setLang(l)}>
                <span style={{ flex: 1, fontWeight: 600 }}>{l}</span>
                <div className={`radio-circle ${lang === l ? "selected" : ""}`} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="btn-outline" onClick={() => setShowLang(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowLang(false)}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showLogout && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Log out?</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>You'll need to sign in again to use Smart Bike.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-danger" style={{ flex: 1 }} onClick={() => navigate("welcome")}>Log Out</button>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowLogout(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LegalScreen({ navigate }) {
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("settings")} />
          <div className="page-title">Legal Information</div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12 }}>Terms Of Use</div>
        {[
          { icon: "👤", title: "Safety Guidelines", body: "Your Safety Is Our Priority. Always Wear A Helmet (Strongly Recommended). Obey All Traffic Laws And Signals. Ride In Designated Bike Lanes When Available." },
          { icon: "✅", title: "User Responsibilities", body: "As A Smart Bike User, you Agree To: Use Bikes Properly And Safely At All Times. Return Bikes To Designated Stations Or Approved Parking Areas. Follow All Local Traffic Laws And Regulations. Report Any Damage Or Mechanical Issues Immediately." },
        ].map(s => (
          <div key={s.title} className="legal-section">
            <div className="legal-header"><span style={{ fontSize: 18 }}>{s.icon}</span>{s.title}</div>
            <div className="legal-body">{s.body}</div>
          </div>
        ))}
        <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12, marginTop: 8 }}>Privacy Policy</div>
        {[
          { icon: "💬", title: "How We Use Your Data", body: "Smart Bike Uses Your Data For: Processing And Completing Your Bike Rentals. Calculating Ride Costs And Processing Payments. Showing Your Ride History And Statistics. Locating Available Bikes Near You." },
          { icon: "🛡️", title: "Data Security", body: "Request A Copy Of All Data We Hold About You. Receive Your Data In A Portable Format. Review How Your Data Is Being Used." },
        ].map(s => (
          <div key={s.title} className="legal-section">
            <div className="legal-header"><span style={{ fontSize: 18 }}>{s.icon}</span>{s.title}</div>
            <div className="legal-body">{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({ navigate, state, setState }) {
  // Pull from localStorage as the primary data source, fall back to state
  const stored = (() => { try { return JSON.parse(localStorage.getItem('bike_app_user')) || {}; } catch { return {}; } })();
  const u = { ...stored, ...(state.user || {}) };

  // Build full name: first + middle + last
  const fullName = [u.first, u.middle, u.last].filter(Boolean).join(' ') || u.name || 'Guest User';
  const initials = fullName.charAt(0).toUpperCase();

  // Masked NID: show first 3 chars + asterisks
  const maskedNid = u.nid ? `${String(u.nid).slice(0, 3)}${'*'.repeat(Math.max(0, String(u.nid).length - 3))}` : null;

  const [waOn, setWaOn] = useState(false);
  const [smsOn, setSmsOn] = useState(false);

  function handleLogout() {
    localStorage.removeItem('bike_app_user');
    if (setState) {
      setState(s => ({
        ...s,
        user: { name: '', email: '', profilePic: '', role: '', phone: '', first: '', last: '', status: null }
      }));
    }
    navigate('welcome');
  }

  const fieldRow = (icon, label, value, badge) => value ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: '#aaa', fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginTop: 2 }}>{value}</div>
      </div>
      {badge}
    </div>
  ) : null;

  return (
    <div style={{ minHeight: '100%', background: 'white' }}>
      <StatusBar />
      <div style={{ padding: '8px 24px 32px' }}>
        {/* Header — no emoji */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate('map')} />
          <div style={{ flex: 1, fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>My Profile</div>
          <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserSettingsIcon size={22} color={DARK} />
          </div>
        </div>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: u.profilePic ? 'transparent' : LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", overflow: 'hidden', color: DARK, flexShrink: 0, boxShadow: `0 0 0 3px ${LIME}` }}>
            {u.profilePic ? <img src={u.profilePic} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: DARK }}>{fullName}</div>
            {u.email && <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{u.email}</div>}
          </div>
        </div>

        {/* Info section */}
        <div style={{ background: '#f9f9f9', borderRadius: 16, padding: '0 16px', marginBottom: 20 }}>
          {fieldRow(
            <PhoneIcon size={18} color={DARK} />,
            'Phone Number',
            u.phone || '—',
            u.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#e8ffe8', borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#2e7d32' }}>
                <ShieldCheckIcon size={13} color="#2e7d32" /> Verified
              </div>
            )
          )}
          {fieldRow(
            <IdCardIcon size={18} color={DARK} />,
            'National ID',
            maskedNid || '—',
            null
          )}
          {fieldRow(
            <WalletIcon size={18} color={DARK} />,
            'Email',
            u.email || '—',
            null
          )}
        </div>

        {/* Quick actions */}
        <div style={{ background: '#f9f9f9', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
          <div className="settings-item" onClick={() => navigate('editProfile')} style={{ gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EditProfileIcon size={18} color={DARK} />
            </div>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>Edit Profile</span>
            <span style={{ color: '#ccc', fontSize: 18 }}>›</span>
          </div>
          <div className="settings-item" onClick={() => navigate('changePassword')} style={{ gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyIcon2 size={18} color={DARK} />
            </div>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>Change Password</span>
            <span style={{ color: '#ccc', fontSize: 18 }}>›</span>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: '#f9f9f9', borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
          <div className="settings-item" style={{ gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#e8fff8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WhatsAppIcon size={18} color="#25D366" />
            </div>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>Notifications via WhatsApp</span>
            <div className={`toggle ${waOn ? 'on' : ''}`} onClick={() => setWaOn(v => !v)} />
          </div>
          <div className="settings-item" style={{ gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#e8f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SMSIcon size={18} color="#007AFF" />
            </div>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>Notifications via SMS</span>
            <div className={`toggle ${smsOn ? 'on' : ''}`} onClick={() => setSmsOn(v => !v)} />
          </div>
        </div>

        {/* Logout */}
        <button
          className="btn-danger"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          onClick={handleLogout}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
}

function EditProfileScreen({ navigate, state, setState }) {
  const [form, setForm] = useState({
    name: state.user.name || "",
    phone: state.user.phone || "",
    email: state.user.email || "",
    address: state.user.address || "",
    card: state.user.card || ""
  });

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <BackBtn onBack={() => navigate("profile")} />
          <div className="page-title">Edit Profile</div>
        </div>
        <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 28px" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>👩</div>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, background: LIME, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✏️</div>
        </div>
        {[
          ["name", "Full name"], ["phone", "Phone number"], ["email", "Email"], ["address", "Address"], ["card", "Personal card"]
        ].map(([key, label]) => (
          <div key={key} style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 600, marginBottom: 4 }}>{label}</div>
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 12 }}>
              <input
                style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              />
              <span style={{ color: "#aaa", fontSize: 18 }}>✏️</span>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" onClick={() => {
            setState(s => ({
              ...s,
              user: { ...s.user, ...form }
            }));
            navigate("profile");
          }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordScreen({ navigate }) {
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("profile")} />
          <div className="page-title">Change Password</div>
        </div>
        {[["Type Current password", "current"], ["Create New Password", "new"], ["Confirm Password", "confirm"]].map(([label, key]) => (
          <div key={key} style={{ marginBottom: 18 }}>
            <label className="input-label">{label}</label>
            <div style={{ position: "relative" }}>
              <input className="input-field" type="password" defaultValue="••••••••••••••••" style={{ paddingRight: 44 }} />
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#aaa", cursor: "pointer", fontSize: 18 }}>👁️</span>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" onClick={() => navigate("profile")}>Change Password</button>
        </div>
      </div>
    </div>
  );
}

function ReportIssueScreen({ navigate }) {
  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <BackBtn onBack={() => navigate("map")} />
          <div className="page-title">Report Issue</div>
        </div>
        <p className="page-subtitle" style={{ marginBottom: 24 }}>Something Wrong With this bike?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#f7f7f7", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => navigate("calling")}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, background: LIME, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📞</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Contact Support</div>
                <div style={{ color: "#888", fontSize: 13 }}>Speak with our team immediately</div>
              </div>
            </div>
            <span style={{ color: "#aaa" }}>›</span>
          </div>
          <div style={{ background: "#f7f7f7", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => navigate("reportBike")}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, background: LIME, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📸</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Report Bike Condition</div>
                <div style={{ color: "#888", fontSize: 13 }}>Submit details of the issue</div>
              </div>
            </div>
            <span style={{ color: "#aaa" }}>›</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportBikeScreen({ navigate }) {
  const [submitted, setSubmitted] = useState(false);
  const [desc, setDesc] = useState("");

  return (
    <div style={{ minHeight: "100%", background: "white" }}>
      <StatusBar />
      <div style={{ padding: "8px 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <BackBtn onBack={() => navigate("reportIssue")} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="page-title">Report Bike Condition</div>
            <p className="page-subtitle">Help us fix the issue</p>
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, fontFamily: "'Space Grotesk',sans-serif" }}>Step 1: Photo of Issue</div>
        <div style={{ background: "#f7f7f7", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 20, cursor: "pointer" }}>
          <div style={{ width: 60, height: 60, background: LIME, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 12 }}>📷</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Take a photo of the issue</div>
          <div style={{ color: "#888", fontSize: 13, marginTop: 4, textAlign: "center" }}>Help us identify the problem</div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, fontFamily: "'Space Grotesk',sans-serif" }}>Step 2: Description (Optional)</div>
        <textarea
          className="input-field"
          style={{ minHeight: 120, resize: "none", borderRadius: 14 }}
          placeholder="Describe the issue in detail..."
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" onClick={() => setSubmitted(true)}>Submit Report</button>
        </div>
      </div>

      {submitted && (
        <div className="modal-overlay modal-overlay-center">
          <div className="modal-card">
            <div style={{ textAlign: "center" }}>
              <div className="success-circle">✓</div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>Report Submitted!</div>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>We will get in touch with you in 5 minutes</p>
              <button className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => navigate("map")}>← Back To Map</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==== APP ====

// simple admin dashboard route, only visible for admin users
function AdminScreen({ navigate, state, setState }) {
  const [approvalEmail, setApprovalEmail] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("");

  useEffect(() => {
    if (state.user.role !== 'admin') {
      navigate('map');
    }
  }, [state.user.role, navigate]);

  function handleApproveUser() {
    if (!approvalEmail.trim()) {
      setApprovalMessage("Please enter an email address.");
      return;
    }
    // Simulate backend approval by updating user status
    const updatedUser = { ...state.user, status: 'approved' };
    setState(s => ({ ...s, user: updatedUser }));
    localStorage.setItem('bike_app_user', JSON.stringify(updatedUser));
    setApprovalMessage(`✓ User ${approvalEmail} has been approved! They can now access the app.`);
    setApprovalEmail("");
  }

  return (
    <div style={{ minHeight: '100%', background: 'white', padding: 24, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ padding: '8px 24px 32px' }}>
        <BackBtn onBack={() => navigate('map')} />
        <div className="page-title" style={{ marginTop: 20, marginBottom: 8 }}>Admin Dashboard</div>
        <p style={{ color: '#888', marginTop: 0, marginBottom: 24 }}>Welcome, {state.user.name}! You have admin access.</p>

        <div style={{ background: '#f8f8f8', borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>Approve User Verification</h3>
          <div style={{ marginBottom: 12 }}>
            <label className="input-label">User Email</label>
            <input
              className="input-field"
              placeholder="user@example.com"
              value={approvalEmail}
              onChange={(e) => setApprovalEmail(e.target.value)}
              type="email"
            />
          </div>
          <button className="btn-primary" onClick={handleApproveUser} style={{ width: '100%' }}>Approve User</button>
        </div>

        {approvalMessage && (
          <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 12, padding: 16, color: '#155724', marginBottom: 24 }}>
            {approvalMessage}
          </div>
        )}

        <div style={{ background: '#e7f3ff', borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 13, color: '#0056b3', lineHeight: 1.6 }}>
            <strong>How it works:</strong><br />
            1. Enter a pending user's email<br />
            2. Click "Approve User" to update their status<br />
            3. Their status changes to 'approved' in localStorage<br />
            4. They'll have full app access on next login
          </div>
        </div>
      </div>
    </div>
  );
}

// === SVG icon components for admin UI ===
const CheckCircleIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2l4-4" />
  </svg>
);
const XCircleIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const MessageSquareIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const PlusIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const LockToggleIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const UnlockIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    <line x1="12" y1="17" x2="12" y2="17" />
  </svg>
);
const BatteryIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
    <line x1="23" y1="13" x2="23" y2="11" />
  </svg>
);
const ShieldAlertIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12" y2="17" />
  </svg>
);
const AlertTriangleIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12" y2="17" />
  </svg>
);
const Trash2Icon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const SettingsIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.06a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.06a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const ActivityIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const DotIcon = ({ color = "currentColor", size = 8, style }) => (
  <svg width={size} height={size} viewBox="0 0 8 8" style={style}>
    <circle cx="4" cy="4" r="4" fill={color} />
  </svg>
);

const LogoutIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

function AdminDashboard({ navigate, state, setState }) {
  const [section, setSection] = useState('users');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [zoomSrc, setZoomSrc] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  // single hardware bike object
  const [bike, setBike] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!state.user || state.user.role !== 'admin') {
      navigate('login');
      return;
    }
  }, [state.user?.role, navigate]);

  useEffect(() => {
    // load pending users from storage
    let allUsers = [];
    try {
      allUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
    } catch { allUsers = []; }
    setPendingUsers(allUsers);

    // load total users count from master list
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]');
    } catch { users = []; }
    setTotalUsers(users.length);

    // load single hardware bike
    const hw = localStorage.getItem('bike_hardware');
    if (hw) {
      try {
        setBike(JSON.parse(hw));
      } catch { setBike(null); }
    } else {
      // default initial object
      const initial = { id: 'BIKE-001', battery: 100, locked: true, coords: { lat: 0, lon: 0 }, health: 'good' };
      localStorage.setItem('bike_hardware', JSON.stringify(initial));
      setBike(initial);
    }

    // load alerts
    const storedAlerts = localStorage.getItem('alerts');
    if (storedAlerts) {
      try { setAlerts(JSON.parse(storedAlerts)); } catch { setAlerts([]); }
    } else {
      setAlerts([]);
    }
  }, []);

  useEffect(() => {
    if (bike) localStorage.setItem('bike_hardware', JSON.stringify(bike));
  }, [bike]);
  useEffect(() => { localStorage.setItem('alerts', JSON.stringify(alerts)); }, [alerts]);

  function handleApproveUser(email) {
    // remove from pending array
    let pending = [];
    try {
      pending = JSON.parse(localStorage.getItem('pending_users') || '[]');
      pending = pending.filter(u => u.email !== email);
      localStorage.setItem('pending_users', JSON.stringify(pending));
    } catch { }
    setPendingUsers(pending);
    setSelectedUser(null);

    // update master users list status
    try {
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      users = users.map(u => u.email === email ? { ...u, status: 'approved' } : u);
      localStorage.setItem('users', JSON.stringify(users));

      // If user is currently logged in, update their state
      const user = users.find(u => u.email === email);
      if (user) {
        console.log('✅ User approved:', user.phone, user.name);
      }
      setTotalUsers(users.length);
    } catch { }
  }

  function handleRejectUser(email) {
    if (window.confirm('Are you sure you want to reject this verification? The user will need to resubmit.')) {
      // remove from pending list
      let pending = [];
      try {
        pending = JSON.parse(localStorage.getItem('pending_users') || '[]');
        pending = pending.filter(u => u.email !== email);
        localStorage.setItem('pending_users', JSON.stringify(pending));
      } catch { }
      setPendingUsers(pending);
      setSelectedUser(null);

      // mark user as rejected in master list and clear their uploads
      try {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.map(u => u.email === email ? {
          ...u,
          status: 'rejected',
          uploads: {} // Clear uploads so they must restart
        } : u);
        localStorage.setItem('users', JSON.stringify(users));

        // Log rejection for admin audit
        const user = users.find(u => u.email === email);
        if (user) {
          console.log('❌ User rejected:', user.phone, user.name);
        }
        setTotalUsers(users.length);
      } catch { }
    }
  }

  function handleSendNote(email, note) {
    if (!note.trim()) {
      alert('Please enter a note');
      return;
    }

    // Update in pending_users array
    try {
      let pending = JSON.parse(localStorage.getItem('pending_users') || '[]');
      pending = pending.map(u => u.email === email ? { ...u, note } : u);
      localStorage.setItem('pending_users', JSON.stringify(pending));
      setPendingUsers(pending);
    } catch { }

    // Update in master users list
    try {
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      users = users.map(u => u.email === email ? { ...u, note } : u);
      localStorage.setItem('users', JSON.stringify(users));
    } catch { }

    // Simulate email notification
    const user = selectedUser;
    if (user && user.phone) {
      console.log('📧 EMAIL NOTIFICATION SENT');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('To:', user.email);
      console.log('Phone:', user.phone);
      console.log('Subject: Message from SmartBike Admin');
      console.log('Body:');
      console.log(note);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');

      // TODO: Integrate real email service here
      // Using EmailJS or Firebase Cloud Functions:
      // await emailjs.send('service_id', 'template_id', {
      //   to_email: user.email,
      //   subject: 'Message from SmartBike Admin',
      //   message: note,
      //   user_name: user.name
      // });
    }

    alert('Note sent to user');
  }

  // helper to update hardware state both locally and in storage
  function updateHardware(changes) {
    if (bike) {
      setBike(b => {
        const updated = { ...b, ...changes };
        localStorage.setItem('bike_hardware', JSON.stringify(updated));
        return updated;
      });
    }
  }

  function setFaulty() {
    if (bike) {
      updateHardware({ health: 'faulty' });
      setAlerts(a => [...a, { bikeId: bike.id, time: Date.now(), message: 'Marked faulty' }]);
    }
  }
  function triggerAlarm(id) { setAlerts(a => [...a, { bikeId: id, time: Date.now(), message: 'Theft alarm triggered' }]); }

  function addBike() {
    const newBike = { id: Date.now(), battery: 100, locked: true, health: 'good', coords: null };
    setBike(newBike);
    localStorage.setItem('bike_hardware', JSON.stringify(newBike));
  }

  // security check: if locked and coords change
  const prevCoords = useRef(bike?.coords);
  useEffect(() => {
    const interval = setInterval(() => {
      const hw = localStorage.getItem('bike_hardware');
      if (!hw) return;
      try {
        const data = JSON.parse(hw);
        if (data.locked && prevCoords.current && data.coords &&
          (data.coords.lat !== prevCoords.current.lat || data.coords.lon !== prevCoords.current.lon)) {
          triggerAlarm(data.id);
        }
        prevCoords.current = data.coords;
        setBike(data);
      } catch { }
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  function handleLogout() {
    if (window.confirm('Log out of admin panel?')) {
      localStorage.removeItem('bike_app_user');
      // Reset to completely empty user — clears admin role and all flags
      setState(s => ({
        ...s,
        user: { name: '', email: '', profilePic: '', role: '', phone: '', first: '', middle: '', last: '', nid: '', status: null, isEditingProfile: false }
      }));
      navigate('welcome');
    }
  }

  if (!state.user || state.user.role !== 'admin') return <div />;

  const lowBattery = bike && bike.battery < 10 ? [bike] : [];
  const theftLogs = alerts;

  return (
    <div style={{ minHeight: "100%", background: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      <div style={{ background: LIME, padding: "20px 24px", color: DARK, marginBottom: 20 }}>
        <div>
          <div className="page-title" style={{ marginBottom: 4, color: DARK }}>Admin Control Panel</div>
          <p style={{ fontSize: 13, color: "#555", margin: 0 }}>Manage users, hardware & monitoring</p>
        </div>
      </div>
      <div style={{ display: "flex", padding: "0 24px", gap: 0, marginBottom: 10 }}>
        {['users', 'bikes', 'monitor'].map(sec => (
          <button key={sec} onClick={() => setSection(sec)} style={{ padding: "12px 20px", border: "none", borderBottom: section === sec ? `4px solid ${LIME}` : "4px solid transparent", background: "none", cursor: "pointer", fontWeight: section === sec ? 700 : 500, textAlign: 'center' }}>
            {sec === 'users' ? 'User Verifications' : sec === 'bikes' ? 'Bike Management' : 'Live Monitoring'}
          </button>
        ))}
      </div>
      <div style={{ padding: "0 24px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 0 }}>
          <div style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 600, marginBottom: 8 }}>Total Users</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: DARK }}>{totalUsers}</div>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.088)" }}>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center' }}><DotIcon color="#ff9800" style={{ marginRight: 4 }} />Pending</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#ff9800" }}>{pendingUsers.length}</div>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.088)" }}>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 600, marginBottom: 8 }}>Total Bikes</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#4CAF50" }}>{bike ? 1 : 0}</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "0 24px 24px", overflow: "auto" }}>
        {section === 'users' && (
          <>
            {pendingUsers.length === 0 ? (
              <div style={{ background: "white", borderRadius: 12, padding: 40, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.088)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}><CheckCircleIcon size={48} color="#4CAF50" /></div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>All Clear!</div>
                <p style={{ color: "#888", fontSize: 14, margin: 0 }}>No pending verifications at this time.</p>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.088)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8f8f8", borderBottom: "2pxsolid #eee" }}>
                      <th style={{ padding: 12, textAlign: "left", fontWeight: 700, fontSize: 12, color: "#666" }}>User</th>
                      <th style={{ padding: 12, textAlign: "left", fontWeight: 700, fontSize: 12, color: "#666" }}>Email</th>
                      <th style={{ padding: 12, textAlign: "center", fontWeight: 700, fontSize: 12, color: "#666" }}>Photos</th>
                      <th style={{ padding: 12, textAlign: "center", fontWeight: 700, fontSize: 12, color: "#666" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((user, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: 12 }}><div style={{ fontWeight: 600, fontSize: 13, color: DARK }}>{user.name || 'User'}</div></td>
                        <td style={{ padding: 12, fontSize: 12, color: "#666" }}>{user.email}</td>
                        <td style={{ padding: 12, textAlign: "center", fontSize: 12 }}><button onClick={() => setSelectedUser(user)} style={{ background: LIME, color: DARK, border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontWeight: 600, fontSize: 11 }}>View Photos</button></td>
                        <td style={{ padding: 12, textAlign: "center" }}><button onClick={() => handleApproveUser(user.email)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: "#4CAF50", color: "white", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontWeight: 600, fontSize: 11, marginRight: 6 }}><CheckCircleIcon size={12} style={{ marginRight: 4 }} />Approve</button><button onClick={() => handleRejectUser(user.email)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: "#f44336", color: "white", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontWeight: 600, fontSize: 11 }}><XCircleIcon size={12} style={{ marginRight: 4 }} />Reject</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {section === 'bikes' && (
          <>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ fontSize: 18, fontWeight: 700 }}>Bike Inventory</div><button onClick={addBike} style={{ background: LIME, color: DARK, border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center' }}><PlusIcon size={14} style={{ marginRight: 6 }} />Add Bike</button></div>
            {!bike ? (
              <p style={{ color: '#888' }}>No hardware bike configured.</p>
            ) : (
              <div style={{ padding: 16 }}>
                <div><strong>ID:</strong> {bike.id}</div>
                <div><strong>Battery:</strong> {bike.battery}%</div>
                <div><strong>Lock:</strong> {bike.locked ? 'Locked' : 'Unlocked'}</div>
                <div><strong>Health:</strong> {bike.health}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button onClick={() => updateHardware({ locked: !bike.locked })} style={{ background: bike.locked ? '#2196F3' : '#FFC107', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>
                    {bike.locked ? <><UnlockIcon size={14} style={{ marginRight: 4 }} />Unlock</> : <><LockToggleIcon size={14} style={{ marginRight: 4 }} />Lock</>}
                  </button>
                  <button onClick={setFaulty} style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>⚠️ Set Faulty</button>
                </div>
              </div>
            )}
          </>
        )}
        {section === 'monitor' && (
          <><div style={{ marginBottom: 24 }}><div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center' }}><ShieldAlertIcon size={18} style={{ marginRight: 6 }} />Triggered Alarms</div>{theftLogs.length === 0 ? (<p style={{ color: '#888' }}>Great! No bikes are currently being stolen.</p>) : (<ul style={{ paddingLeft: 20 }}>{theftLogs.map((a, idx) => <li key={idx} style={{ fontSize: 13, marginBottom: 4 }}>{new Date(a.time).toLocaleString()}: Bike {a.bikeId} – {a.message}</li>)}</ul>)}</div><div><div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center' }}><BatteryIcon size={18} style={{ marginRight: 6 }} />Low Battery (&lt;10%)</div>{lowBattery.length === 0 ? (<p style={{ color: '#888' }}>All bike batteries are above 10%.</p>) : (<table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#f8f8f8', borderBottom: '2px solid #eee' }}><th style={{ padding: 12, textAlign: 'left', fontWeight: 700, fontSize: 12, color: '#666' }}>Bike ID</th><th style={{ padding: 12, textAlign: 'center', fontWeight: 700, fontSize: 12, color: '#666' }}>Battery</th></tr></thead><tbody>{lowBattery.map(b => <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: 12 }}>{b.id}</td><td style={{ padding: 12, textAlign: 'center' }}>{b.battery}%</td></tr>)}</tbody></table>)}</div></>
        )}
      </div>

      {selectedUser && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 24, maxWidth: 400, maxHeight: "80vh", overflow: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
            {zoomSrc && (
              <div onClick={() => setZoomSrc(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, cursor: 'pointer' }}>
                <img src={zoomSrc} style={{ maxWidth: '90%', maxHeight: '90%' }} />
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontFamily: "'Space Grotesk',sans-serif", fontSize: 18 }}>Verification Photos</h3>
              <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#888" }}>×</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Applicant: <strong>{selectedUser.name}</strong></div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Email: <strong>{selectedUser.email}</strong></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {selectedUser.uploads ? Object.entries(selectedUser.uploads).map(([key, img]) => (
                  img ? (
                    <div key={key} style={{ borderRadius: 8, overflow: "hidden", background: "#f0f0f0", border: "2px solid #e0e0e0" }}>
                      <img src={img} alt={key} onClick={() => setZoomSrc(img)} style={{ width: "100%", height: 150, objectFit: "contain", padding: 8, cursor: 'pointer' }} />
                      <div style={{ fontSize: 10, textAlign: "center", padding: "8px 4px", background: "#f8f8f8", fontWeight: 600, color: "#666" }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ) : null
                )) : (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 20, color: "#888" }}>No photos found</div>
                )}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              {selectedUser.note && <p style={{ fontSize: 12, color: '#333', marginBottom: 8 }}>Previous note: {selectedUser.note}</p>}
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Enter note for user" style={{ width: "100%", minHeight: 80, padding: 8, marginBottom: 8 }} />
              <button onClick={() => { handleSendNote(selectedUser.email, noteText); setNoteText(''); alert('Note sent'); }} style={{ background: LIME, color: DARK, border: "none", borderRadius: 6, padding: "8px 12px", cursor: "pointer", fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquareIcon size={14} style={{ marginRight: 6 }} />Send Note</button>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => handleApproveUser(selectedUser.email)} style={{ flex: 1, background: "#4CAF50", color: "white", border: "none", borderRadius: 8, padding: 12, cursor: "pointer", fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircleIcon size={14} style={{ marginRight: 6 }} />Approve User</button>
              <button onClick={() => handleRejectUser(selectedUser.email)} style={{ flex: 1, background: "#f44336", color: "white", border: "none", borderRadius: 8, padding: 12, cursor: "pointer", fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><XCircleIcon size={14} style={{ marginRight: 6 }} />Reject User</button>
            </div>
          </div>
        </div>
      )}

      {/* bottom logout button placed outside header for clean layout */}
      <div style={{ marginTop: 'auto', padding: '12px 24px', background: 'white', borderTop: '1px solid #eee' }}>
        <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', padding: '8px 0' }}>Logout</button>
      </div>
    </div>
  );
}

const SCREENS = {
  splash: SplashScreen,
  onboard1: Onboard1,
  onboard2: Onboard2,
  onboard3: Onboard3,
  welcome: WelcomeScreen,
  login: LoginScreen,
  otpMethod: OtpMethodScreen,
  otp: OtpScreen,
  phoneVerified: PhoneVerifiedScreen,
  register: RegisterScreen,
  scanId: ScanIdScreen,
  scanComplete: ScanCompleteScreen,
  statusDashboard: StatusDashboardScreen,
  pending: PendingApprovalScreen,
  adminDashboard: AdminDashboard,
  map: MapScreen,
  reserve: ReserveScreen,
  reserved: ReservedScreen,
  bikeFound: BikeFoundScreen,
  scanQR: ScanQRScreen,
  riding: RidingScreen,
  calling: CallingScreen,
  verifyLock: VerifyLockScreen,
  rideComplete: RideCompleteScreen,
  payment: PaymentScreen,
  paymentMethod: PaymentMethodScreen,
  paymentSuccess: PaymentSuccessScreen,
  history: HistoryScreen,
  howToRide: HowToRideScreen,
  notifications: NotificationsScreen,
  settings: SettingsScreen,
  legal: LegalScreen,
  profile: ProfileScreen,
  editProfile: EditProfileScreen,
  changePassword: ChangePasswordScreen,
  reportIssue: ReportIssueScreen,
  reportBike: ReportBikeScreen,
  admin: AdminScreen,
};

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [state, setState] = useState({
    selectedBike: null,
    otpMethod: "sms", // Track selected OTP method for demo/firebase integration
    user: { name: "", email: "", profilePic: "", role: "", phone: "", first: "", last: "", status: null }
  });

  // Load user state from localStorage on mount
  useEffect(() => {
    // Check for saved user session
    try {
      const savedUser = localStorage.getItem('bike_app_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        // Don't auto-load rejected users - they need to restart
        if (parsedUser.status === 'rejected') {
          console.log('User was rejected, starting fresh');
          localStorage.removeItem('bike_app_user');
          return;
        }

        setState(s => ({ ...s, user: parsedUser }));

        // Route based on user status and role
        if (parsedUser.role === 'admin' && parsedUser.status === 'active') {
          setScreen('adminDashboard');
        } else if (parsedUser.status === 'approved') {
          setScreen('map');
        } else if (parsedUser.status === 'pending') {
          setScreen('statusDashboard');
        } else {
          // User exists but no status - redirect to login
          setScreen('login');
        }
        return;
      }
    } catch (e) {
      console.error('Failed to load user state:', e);
    }

    // No saved user found - show splash/login
    setScreen('splash');
  }, []);

  // Save user state to localStorage whenever it changes
  useEffect(() => {
    if (state.user.name || state.user.status || state.user.role) {
      localStorage.setItem('bike_app_user', JSON.stringify(state.user));
    }
  }, [state.user]);

  const Screen = SCREENS[screen] || MapScreen;


  return (
    <>
      <style>{styles}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 0" }}>
        <div className="phone-frame">
          <div className="screen">
            <Screen navigate={setScreen} state={state} setState={setState} />
          </div>
        </div>
        <div style={{ color: "#666", fontSize: 13, textAlign: "center", fontFamily: "'Space Grotesk', sans-serif" }}>
          Smart Bike App · All {Object.keys(SCREENS).length} screens connected
        </div>
      </div>
    </>
  );
}

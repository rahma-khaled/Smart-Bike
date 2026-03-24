import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import localforage from 'localforage';
import {
  LayoutDashboard, Bike, Users, MapPin, CreditCard, BarChart3, LogOut, Zap, Activity
} from "lucide-react";

const links = [
  { to: "/admin/dashboard",  label: "Dashboard",   Icon: LayoutDashboard },
  { to: "/admin/bikes",      label: "Bikes",       Icon: Bike            },
  { to: "/admin/users",      label: "Users",       Icon: Users           },
  { to: "/admin/trips",      label: "Trips",       Icon: MapPin          },
  { to: "/admin/payments",   label: "Payments",    Icon: CreditCard      },
  { to: "/admin/reports",    label: "Reports",     Icon: BarChart3       },
  { to: "/admin/logs",       label: "System Logs", Icon: Activity        },
];

export default function Sidebar({ navigate: setScreen, setState }) {
  const navigate = useNavigate();

  const handleClearSession = async () => {
    localStorage.clear();
    await localforage.clear();
    window.location.href = '/';
  };

  const handleExit = () => {
    // Return to the mobile map view without clearing session
    if (setScreen) setScreen('map');
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('bike_app_user');
    localStorage.removeItem('admin_mode');
    if (setState) {
      setState(s => ({
        ...s,
        isAdminMode: false,
        user: { name: "", email: "", profilePic: "", role: "", phone: "", first: "", last: "", status: null }
      }));
    }
    if (setScreen) setScreen('welcome');
    navigate('/');
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#111] border-r border-white/5 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-[#CCFF00] flex items-center justify-center">
          <Zap size={18} className="text-[#111]" />
        </div>
        <div>
          <div className="text-white font-bold text-base font-['Space_Grotesk']">SmartBike</div>
          <div className="text-gray-500 text-xs">Admin Portal</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-[#CCFF00] text-[#111] font-bold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? "text-[#111]" : "text-gray-400 group-hover:text-white"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Navigation Footer */}
      <div className="px-3 pb-6 space-y-1">
        <button
          onClick={handleExit}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut size={18} /> Exit to App
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} className="rotate-180" /> Logout
        </button>
        <button
          onClick={handleClearSession}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-xs font-medium text-gray-600 hover:text-white transition-all border-t border-white/5 mt-2 pt-2"
        >
          <Zap size={14} /> [Debug] Clear Session
        </button>
      </div>
    </aside>
  );
}

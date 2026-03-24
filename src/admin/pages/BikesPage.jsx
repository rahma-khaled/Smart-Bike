import React, { useState, useContext, useEffect } from "react";
import * as Icons from "../../assets/Icons.jsx";
import { SearchContext } from "../components/AdminLayout.jsx";
import ViewBikeModal from "../components/ViewBikeModal.jsx";
import { logAdminAction } from "../utils/logger.js";

// ── Status Constants ──
const STATUS_STYLE = {
  available:   "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  active:      "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  low_battery: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  offline:     "bg-red-500/10 text-red-400 border border-red-500/20",
};

const ZONES_COORDS = {
  "Zone A": { lat: 31.4175, lng: 31.8144 },
  "Zone B": { lat: 31.4220, lng: 31.8200 },
  "Zone C": { lat: 31.4100, lng: 31.8080 }
};

const ZONES = ["All", "Zone A", "Zone B", "Zone C"];
const STATUSES = ["All", "available", "active", "low_battery", "offline"];

// ── Sub-Components ──

function AddBikeModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ id: "", rfid: "", zone: "Zone A", battery: 100 });
  function submit(e) {
    e.preventDefault();
    if (!form.id || !form.rfid) return;
    const center = ZONES_COORDS[form.zone] || ZONES_COORDS["Zone A"];
    const lat = center.lat + (Math.random() - 0.5) * 0.001;
    const lng = center.lng + (Math.random() - 0.5) * 0.001;
    const batteryCapped = Math.min(parseInt(form.battery) || 0, 100);
    onAdd({ ...form, battery: batteryCapped, status: 'available', locked: true, lat, lng });
    onClose();
  }
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">Add New Bike</h2>
          <button onClick={onClose} className="p-2 -mr-2 bg-white/0 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
            <Icons.XIcon size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">Bike ID</label>
            <input required value={form.id} onChange={e => setForm(f=>({...f,id:e.target.value}))}
              placeholder="BK-701"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#CCFF00]/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">RFID Tag</label>
            <input required value={form.rfid} onChange={e => setForm(f=>({...f,rfid:e.target.value}))}
              placeholder="RF-X99"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#CCFF00]/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">Deployment Zone</label>
            <select value={form.zone} onChange={e => setForm(f=>({...f,zone:e.target.value}))}
              className="w-full bg-[#222] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#CCFF00]/50">
              {ZONES.filter(z => z !== 'All').map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:text-white transition-all bg-transparent">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-[#CCFF00] text-[#111] font-bold">Save Bike</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditBikeModal({ bike, onClose, onEdit }) {
  const [form, setForm] = useState({ ...bike, battery: Math.max(0, Math.min(parseInt(bike.battery) || 0, 100)) });
  function handleBatteryChange(e) {
    const raw = e.target.value;
    if (raw === '') { setForm(f => ({ ...f, battery: '' })); return; }
    const val = Math.max(0, Math.min(100, parseInt(raw) || 0));
    setForm(f => ({ ...f, battery: val }));
  }
  function submit(e) {
    e.preventDefault();
    onEdit({ ...form, battery: Math.max(0, Math.min(100, parseInt(form.battery) || 0)) });
    onClose();
  }
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">Edit Bike</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icons.XIcon size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">Bike ID</label>
            <input required value={form.id} onChange={e => setForm(f=>({...f,id:e.target.value}))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#CCFF00]/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">RFID Tag</label>
            <input required value={form.rfid} onChange={e => setForm(f=>({...f,rfid:e.target.value}))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#CCFF00]/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5 font-medium">Battery Level (%)</label>
            <input type="number" min="0" max="100" value={form.battery} onChange={handleBatteryChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#CCFF00]/50" />
            <span className="text-gray-600 text-xs mt-1 block">Value must be between 0 and 100</span>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:text-white transition-all bg-transparent">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-[#CCFF00] text-[#111] font-bold">Update Bike</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ bike, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
           style={{ animation: 'modalZoomIn 0.2s ease-out' }}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <Icons.TrashIcon size={28} color="#F44336" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-1">Delete Bike</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Are you sure you want to delete <span className="text-white font-bold">{bike?.id}</span>? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 w-full pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:text-white hover:border-white/20 transition-all bg-transparent"
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(bike.id); onClose(); }}
              className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const toastKeyframes = `
@keyframes toastSlideIn {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes modalZoomIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
`;

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      <style>{toastKeyframes}</style>
      <div
        className="fixed bottom-6 left-1/2 z-[200]"
        style={{ animation: 'toastSlideIn 0.35s ease-out forwards' }}
      >
        <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
          type === 'error'
            ? 'bg-red-500/90 border-red-500/20 text-white'
            : 'bg-[#1a1a1a]/95 border-[#CCFF00]/30 text-[#CCFF00]'
        }`}>
          {type === 'error'
            ? <Icons.XCircleIcon size={18} color="#fff" />
            : <Icons.CheckCircleIcon size={18} color="#CCFF00" />
          }
          <div className="font-bold font-['Space_Grotesk'] text-sm">{message}</div>
          <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
            <Icons.XIcon size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main Component ──

export default function BikesPage({ bikes = [], setBikes }) {
  const { search } = useContext(SearchContext);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterZone, setFilterZone] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [selectedBikeDetails, setSelectedBikeDetails] = useState(null);
  const [deletingBike, setDeletingBike] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const filtered = bikes.filter(b => {
    if (!b) return false;
    const matchSearch = (b.id || "").toLowerCase().includes(search.toLowerCase()) || 
                       (b.rfid || "").toLowerCase().includes(search.toLowerCase()) || 
                       (b.zone || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || b.status === filterStatus;
    const matchZone   = filterZone === "All"   || b.zone === filterZone;
    return matchSearch && matchStatus && matchZone;
  });

  const toggleBikeLock = (id) => {
    const b = bikes.find(x => x.id === id);
    if (!b) return;
    const newLocked = !b.locked;
    const newBikes = bikes.map(x => x.id === id ? { 
      ...x, 
      locked: newLocked, 
      status: newLocked ? 'available' : 'active' 
    } : x);
    setBikes(newBikes);
    logAdminAction(newLocked ? "Lock Bike" : "Unlock Bike", `Bike ${id} ${newLocked ? 'locked' : 'unlocked'}`);
    showToast(`Bike ${id} ${newLocked ? 'Locked' : 'Unlocked'} successfully`);
  };

  const handleDelete = (bike) => {
    setDeletingBike(bike);
  };

  const confirmDelete = (id) => {
    setBikes(bikes.filter(bike => bike.id !== id));
    logAdminAction("Delete Bike", `Bike ${id} deleted permanently`);
    showToast(`Bike ${id} deleted successfully`);
    setDeletingBike(null);
  };

  const handleUpdateBike = (updated) => {
    const capped = { ...updated, battery: Math.min(parseInt(updated.battery) || 0, 100) };
    setBikes(bikes.map(x => x.id === editingBike.id ? capped : x));
    setEditingBike(null);
    logAdminAction("Update Bike", `Bike ${updated.id} parameters updated (Battery: ${capped.battery}%, Status: ${capped.status})`);
    showToast(`Bike ${updated.id} updated successfully`);
  };

  const handleAddBike = (newBike) => {
    setBikes([newBike, ...bikes]);
    setShowAddModal(false);
    logAdminAction("Add Bike", `New Bike ${newBike.id} deployed to ${newBike.zone}`);
    showToast(`Bike ${newBike.id} added successfully`);
  };

  return (
    <div className="space-y-6 relative h-full">
      {/* Modals & Toasts */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showAddModal && <AddBikeModal onClose={() => setShowAddModal(false)} onAdd={handleAddBike} />}
      {editingBike && <EditBikeModal bike={editingBike} onClose={() => setEditingBike(null)} onEdit={handleUpdateBike} />}
      {selectedBikeDetails && <ViewBikeModal bike={selectedBikeDetails} onClose={() => setSelectedBikeDetails(null)} />}
      {deletingBike && <ConfirmDeleteModal bike={deletingBike} onClose={() => setDeletingBike(null)} onConfirm={confirmDelete} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">Bike Management</h1>
          <p className="text-gray-500 text-sm mt-1">{bikes.length} total bikes in system</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-[#CCFF00] text-[#111] font-bold rounded-xl flex items-center gap-2 hover:brightness-110 transition-all">
          <Icons.PlusIcon size={18} /> Add Bike
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#161616] border border-white/10 rounded-xl px-3 py-2">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Status</span>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-transparent text-gray-300 text-sm focus:outline-none">
            {STATUSES.map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-[#161616] border border-white/10 rounded-xl px-3 py-2">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Zone</span>
          <select value={filterZone} onChange={e => setFilterZone(e.target.value)}
            className="bg-transparent text-gray-300 text-sm focus:outline-none">
            {ZONES.map(z => <option key={z} value={z}>{z === "All" ? "All Zones" : z}</option>)}
          </select>
        </div>
        <span className="ml-auto text-sm text-gray-500">{filtered.length} bikes showing</span>
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Bike ID</th>
                <th className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">RFID</th>
                <th className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Battery</th>
                <th className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Zone</th>
                <th className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Security</th>
                <th className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(bike => (
                <tr key={bike.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#CCFF00]">
                        <Icons.BikeIconSVG size={16} />
                      </div>
                      <span className="text-white font-bold font-['Space_Grotesk']">{bike.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{bike.rfid}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLE[bike.status] || STATUS_STYLE.available}`}>
                      {bike.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#CCFF00] rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(bike.battery, 100)}%` }} 
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{Math.min(bike.battery, 100)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{bike.zone}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {bike.locked ? (
                        <Icons.LockIcon size={14} color="#f97316" />
                      ) : (
                        <Icons.UnlockIcon size={14} color="#10b981" />
                      )}
                      <span className={`text-[11px] font-bold ${bike.locked ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {bike.locked ? 'LOCKED' : 'UNLOCKED'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedBikeDetails(bike)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-[#CCFF00]/20 text-gray-400 hover:text-[#CCFF00] transition-all"
                        title="View Details"
                      >
                        <Icons.EyeIcon size={16} />
                      </button>
                      <button 
                        onClick={() => setEditingBike(bike)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all"
                        title="Edit Bike"
                      >
                        <Icons.PencilIcon size={16} />
                      </button>
                      <button 
                        onClick={() => toggleBikeLock(bike.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-orange-500/20 text-gray-400 hover:text-orange-400 transition-all"
                        title={bike.locked ? "Unlock Bike" : "Lock Bike"}
                      >
                        {bike.locked ? <Icons.UnlockIcon size={16} /> : <Icons.LockIcon size={16} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(bike)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-500 transition-all"
                        title="Delete Bike"
                      >
                        <Icons.TrashIcon size={16} color="#F44336" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Icons.BikeIconSVG size={48} color="#888" />
                      <p className="text-white text-lg font-medium">No bikes found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

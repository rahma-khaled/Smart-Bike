import React, { useState, useEffect } from "react";
import localforage from "localforage";
import { Clock, User, Activity, AlertTriangle } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Poll for fresh logs when component mounts
    localforage.getItem("admin_logs").then(data => {
      setLogs(data || []);
    });
    
    // Auto-refresh interval (for IoT system checks)
    const t = setInterval(() => {
      localforage.getItem("admin_logs").then(data => setLogs(data || []));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">System Logs</h1>
          <p className="text-gray-400 mt-1">Audit trail for all operator and IoT system actions.</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Operator</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500">
                    <Activity size={32} className="mx-auto mb-3 opacity-30" />
                    No system logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log, i) => (
                  <tr key={i} className={`border-b border-white/5 last:border-0 ${log.isSystem ? "bg-red-500/10" : "hover:bg-white/5"} transition-colors`}>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="opacity-50" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium">
                        {log.isSystem ? <AlertTriangle size={14} className="text-red-400" /> : <User size={14} className="text-[#CCFF00]" />}
                        <span className={log.isSystem ? "text-red-400" : "text-white"}>{log.operator}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-200">{log.action}</td>
                    <td className="p-4 text-gray-400 max-w-md truncate" title={log.details}>{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

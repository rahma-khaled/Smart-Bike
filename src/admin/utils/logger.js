import localforage from "localforage";

export async function logAdminAction(action, details) {
  try {
    const operator = sessionStorage.getItem("activeAdminName") || "Unknown Operator";
    const logs = await localforage.getItem("admin_logs") || [];
    logs.unshift({
      timestamp: new Date().toISOString(),
      operator,
      action,
      details,
      isSystem: false
    });
    await localforage.setItem("admin_logs", logs);
  } catch(err) {
    console.error("Admin Log Write Failed", err);
  }
}

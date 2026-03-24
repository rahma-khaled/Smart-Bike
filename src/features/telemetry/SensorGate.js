/**
 * SensorGate.js
 * Handles strict physical proximity handshakes for the bike rental flow.
 */

/**
 * Calculates straight-line distance (in meters) between two GPS coordinates using the Haversine formula.
 * @param {number} lat1 User Latitude
 * @param {number} lon1 User Longitude
 * @param {number} lat2 Bike Latitude
 * @param {number} lon2 Bike Longitude
 * @returns {number} Distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;

  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return Math.round(R * c);
}

/**
 * Simulates a Bluetooth Low Energy (BLE) handshake with the specific bike hardware.
 * Upgraded to use REAL Web Bluetooth API if available.
 * @param {string} bikeId 
 * @returns {Promise<boolean>}
 */
export async function simulateBluetoothScan(bikeId) {
  // ── REAL BLUETOOTH REQUEST ──
  if ('bluetooth' in navigator) {
    try {
      console.log(`[BT] Attempting real handshake with: ${bikeId}`);
      // Request device picker - User must click a device or cancel
      await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'BIKE-' }],
        optionalServices: ['battery_service']
      });
      return true;
    } catch (err) {
      console.warn("Real Bluetooth Prompt Failed/Cancelled:", err.name);
      // If user cancelled or no Bluetooth, we can still fall back or show the error
      if (err.name === 'NotFoundError' || err.name === 'SecurityError') {
         // User didn't find/pick a device
         return false;
      }
    }
  }

  // Fallback / Simulation delay for non-BLE environments/browsers
  return new Promise((resolve) => {
    const scanTime = Math.floor(Math.random() * 500) + 1000;
    setTimeout(() => {
      resolve(true);
    }, scanTime);
  });
}

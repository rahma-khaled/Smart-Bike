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
 * Represents the final physical assurance step before unlocking.
 * @param {string} bikeId 
 * @returns {Promise<boolean>}
 */
export function simulateBluetoothScan(bikeId) {
  return new Promise((resolve) => {
    // Simulate radio frequency scan latency (1.5 to 2.5 seconds)
    const scanTime = Math.floor(Math.random() * 1000) + 1500;
    
    setTimeout(() => {
      // In a production app, this would use the Web Bluetooth API or a React Native BLE bridge
      // For this prototype, we simulate a successful hardware ping.
      resolve(true);
    }, scanTime);
  });
}

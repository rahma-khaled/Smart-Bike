// Damietta bike locations (actual lat/lng near city center)
export const DAMIETTA_BIKES = [
  { lat: 0, lng: 0, id: "B-LOCAL", name: "My Test Bike", battery: "85 M", status: "Locked", rate: "5 EGP / Hr" }
];

// Damietta geofence center and GLOBAL radius (700km for unrestricted testing)
export const DAMIETTA_CENTER = { lat: 31.4165, lng: 31.8133 };
export const DAMIETTA_RADIUS = 700000; // 700,000 meters (Global Zone)

// Damietta geofence polygon (keeping as secondary visual reference if needed)
export const DAMIETTA_GEOFENCE = [
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

export function isWithinServiceZone(lat, lng) {
  // HARD OVERRIDE FOR TEST DEMO: Always allow
  return true; 
}

export function pointInPolygon(lat, lng, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

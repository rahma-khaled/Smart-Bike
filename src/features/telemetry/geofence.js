// Damietta bike locations (actual lat/lng near city center)
export const DAMIETTA_BIKES = [
  { lat: 31.4175, lng: 31.8144, id: "A24", battery: "120 M", status: "Unlocked", rate: "0.5 EGP / Min" },
  { lat: 31.4220, lng: 31.8200, id: "B04", battery: "80 M", status: "Locked", rate: "0.5 EGP / Min" },
  { lat: 31.4100, lng: 31.8080, id: "C12", battery: "200 M", status: "Unlocked", rate: "0.6 EGP / Min" },
  { lat: 31.4260, lng: 31.8050, id: "D07", battery: "150 M", status: "Unlocked", rate: "0.5 EGP / Min" },
  { lat: 31.4130, lng: 31.8230, id: "E03", battery: "300 M", status: "Locked", rate: "0.4 EGP / Min" },
];

// Damietta geofence center and radius (20km)
export const DAMIETTA_CENTER = { lat: 31.4165, lng: 31.8133 };
export const DAMIETTA_RADIUS = 20000; // 20,000 meters

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
  if (!lat || !lng) return false;
  
  // Precise distance from Damietta center
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat * Math.PI / 180;
  const φ2 = DAMIETTA_CENTER.lat * Math.PI / 180;
  const Δφ = (DAMIETTA_CENTER.lat - lat) * Math.PI / 180;
  const Δλ = (DAMIETTA_CENTER.lng - lng) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance <= DAMIETTA_RADIUS;
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

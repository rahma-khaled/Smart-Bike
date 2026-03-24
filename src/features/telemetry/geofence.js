// Damietta bike locations (actual lat/lng near city center)
export const DAMIETTA_BIKES = [
  { lat: 31.4175, lng: 31.8144, id: "A24", battery: "120 M", status: "Unlocked", rate: "0.5 EGP / Min" },
  { lat: 31.4220, lng: 31.8200, id: "B04", battery: "80 M", status: "Locked", rate: "0.5 EGP / Min" },
  { lat: 31.4100, lng: 31.8080, id: "C12", battery: "200 M", status: "Unlocked", rate: "0.6 EGP / Min" },
  { lat: 31.4260, lng: 31.8050, id: "D07", battery: "150 M", status: "Unlocked", rate: "0.5 EGP / Min" },
  { lat: 31.4130, lng: 31.8230, id: "E03", battery: "300 M", status: "Locked", rate: "0.4 EGP / Min" },
];

// Damietta geofence polygon coordinates
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

import React, { useState, useEffect, useRef } from "react";
import { LIME, DARK } from '../../constants/theme.js';
import * as Icons from '../../assets/Icons.jsx';
import { DAMIETTA_BIKES, DAMIETTA_GEOFENCE, pointInPolygon } from './geofence';

export default
  function LeafletMap({ bikes = [], onBikeClick, selectedBike, userLocation }) {
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
      if (!mapRef.current) return;
      const L = window.L;
      if (!L) return;

      // Initialize map instance if not present
      if (!mapInstanceRef.current) {
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

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      // Add bike markers
      const bikeIcon = (isSelected, status) => {
        const statusColors = { available: LIME, active: '#22d3ee', low_battery: '#f97316', offline: '#ef4444' };
        const color = statusColors[status] || LIME;
        return L.divIcon({
          className: '',
          html: `<div style="
            width:40px;height:40px;
            background:${color};
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            display:flex;align-items:center;justify-content:center;
            box-shadow:${isSelected ? `0 0 0 3px white,0 0 0 5px ${color}` : '0 3px 10px rgba(0,0,0,0.25)'};
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
      };

      const bikesToShow = bikes.length > 0 ? bikes : DAMIETTA_BIKES;

      bikesToShow.forEach((b, i) => {
        const lat = b.lat || 31.4175;
        const lng = b.lng || 31.8144;
        const marker = L.marker([lat, lng], { icon: bikeIcon(selectedBike === i, b.status), draggable: false })
          .addTo(map)
          .on('click', () => onBikeClick && onBikeClick(i));

        // Check if outside geofence
        if (!pointInPolygon(lat, lng, DAMIETTA_GEOFENCE) && !geofenceAlertedRef.current) {
          geofenceAlertedRef.current = true;
          setTimeout(() => {
            alert('Outside Service Zone – Please return to Damietta area to avoid fines.');
          }, 500);
        }
        markersRef.current.push(marker);
      });

      // Draw User Blue Dot
      if (userLocation) {
        markersRef.current.push(
          L.circleMarker([userLocation.lat, userLocation.lng], {
            radius: 20, fillColor: '#007AFF', color: 'transparent', fillOpacity: 0.15
          }).addTo(map)
        );
        markersRef.current.push(
          L.circleMarker([userLocation.lat, userLocation.lng], {
            radius: 8, fillColor: '#007AFF', color: '#ffffff', weight: 3, opacity: 1, fillOpacity: 1
          }).addTo(map)
        );
      }
    };

    // Load Leaflet JS if not already loaded or just call loadMap
    if (window.L) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = loadMap;
      document.head.appendChild(script);
    }

    return () => {
      // Don't remove map instance here to keep it stable during prop updates
      // but we do need to cleanup markers if we were actually unmounting
    };
  }, [bikes, selectedBike, userLocation]);

  // Handle actual unmount only
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', background: '#e8eaf0' }}
    />
  );
}
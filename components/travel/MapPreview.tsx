'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: #0d9488; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function MapPreview({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  return (
    <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer 
        center={[lat, lng]} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        />
        <Marker position={[lat, lng]} icon={customIcon} />
      </MapContainer>
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-sm font-semibold text-slate-800 shadow-md z-[400]">
        Selected: {name}
      </div>
    </div>
  );
}

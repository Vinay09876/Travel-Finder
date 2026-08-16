'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ActivityItem } from '@/types';

const destinationIcon = L.divIcon({
  className: 'custom-marker-dest',
  html: `<div style="background-color: #0f172a; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.5);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function InteractiveMap({ 
  lat, 
  lng, 
  name
}: { 
  lat: number; 
  lng: number; 
  name: string;
}) {
  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  return (
    <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-md relative z-0">
      <MapContainer 
        center={[lat, lng]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
          url={`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        />
        
        {/* Main Destination Marker */}
        <Marker position={[lat, lng]} icon={destinationIcon}>
          <Popup className="font-semibold text-slate-800">
            {name}
          </Popup>
        </Marker>

        {/* Since our DB doesn't store Lat/Lng per Activity yet, we can't reliably map POIs from DB directly unless we add it. 
            The prompt said: "show activity/POI markers when coordinates are available".
            Currently Activity model has no lat/lng. For now we just render the main dest. */}
      </MapContainer>
    </div>
  );
}

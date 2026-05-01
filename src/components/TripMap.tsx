"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface TripMapProps {
  days: {
    index: number;
    activities: {
      title: string;
      lat: number | null;
      lng: number | null;
    }[];
  }[];
}

export default function TripMap({ days }: TripMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[500px] bg-slate-100 rounded-[2.5rem] animate-pulse" />;

  // Filter activities with valid lat/lng
  const allPoints = days.flatMap(day => 
    day.activities
      .filter(act => act.lat !== null && act.lng !== null)
      .map(act => ({
        lat: act.lat as number,
        lng: act.lng as number,
        title: act.title,
        dayIndex: day.index
      }))
  );

  if (allPoints.length === 0) return null;

  const center: [number, number] = [allPoints[0].lat, allPoints[0].lng];

  // Group points by day for paths
  const dayPaths = days.map(day => 
    day.activities
      .filter(act => act.lat !== null && act.lng !== null)
      .map(act => [act.lat as number, act.lng as number] as [number, number])
  ).filter(path => path.length > 1);

  return (
    <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-luxury-2xl z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {allPoints.map((point, idx) => (
          <Marker key={idx} position={[point.lat, point.lng]}>
            <Popup>
              <div className="font-bold">
                <span className="text-indigo-600">Day {point.dayIndex}:</span> {point.title}
              </div>
            </Popup>
          </Marker>
        ))}

        {dayPaths.map((path, idx) => (
          <Polyline 
            key={idx} 
            positions={path} 
            color="#4f46e5" 
            weight={3} 
            dashArray="10, 10" 
            opacity={0.6}
          />
        ))}
      </MapContainer>
    </div>
  );
}

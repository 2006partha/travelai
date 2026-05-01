"use client";

import dynamic from "next/dynamic";

// Hum dynamic import ko yahan Client Component mein move kar rahe hain
// taaki 'ssr: false' correctly kaam kare.
const Map = dynamic(() => import("./TripMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-slate-100 rounded-[2.5rem] animate-pulse flex items-center justify-center text-slate-400 font-bold">
      Architecting Map View...
    </div>
  )
});

interface TripMapClientProps {
  days: {
    index: number;
    activities: {
      title: string;
      lat: number | null;
      lng: number | null;
    }[];
  }[];
}

export default function TripMapClient({ days }: TripMapClientProps) {
  return <Map days={days} />;
}

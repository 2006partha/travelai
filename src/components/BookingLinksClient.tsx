"use client";
import { useState } from "react";
import { getBookingLinksForTrip } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";

export function BookingLinksClient({ destination, startDate, endDate }: { destination: string, startDate: string, endDate: string }) {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  async function handleFetch() {
    setLoading(true);
    try {
      const res = await getBookingLinksForTrip(destination, startDate, endDate);
      setLinks(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setFetched(true);
  }

  if (!fetched && !loading) {
    return (
      <Button onClick={handleFetch} variant="outline" className="w-full mt-4 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10">
        Generate Booking Links with AI
      </Button>
    );
  }

  if (loading) {
    return <div className="text-zinc-400 text-sm mt-4 text-center animate-pulse">Generating booking links...</div>;
  }

  if (links.length === 0) {
    return <div className="text-zinc-500 text-sm mt-4 text-center">No links generated.</div>;
  }

  return (
    <div className="mt-6 border-t border-zinc-800/50 pt-4">
      <h4 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Booking Links</h4>
      <div className="flex flex-wrap gap-3">
        {links.map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
            {link.type === 'Flight' ? '✈️' : link.type === 'Hotel' ? '🏨' : '🎟️'} 
            <span className="text-zinc-200">{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

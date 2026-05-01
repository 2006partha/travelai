"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { regenerateTripAction } from "@/app/actions/itinerary";
import { Button } from "./ui/button";
import { Sparkles, TrendingDown, Map as MapIcon, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";


export function TripRefinementButtons({ tripId }: { tripId: string }) {
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const router = useRouter();

  const options = [
    { label: "Make it cheaper", refinement: "Optimize the itinerary for a lower budget while keeping the core experiences.", icon: TrendingDown, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Add more adventure", refinement: "Add more high-energy, outdoor, or adventurous activities.", icon: MapIcon, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Less crowded places", refinement: "Focus on hidden gems and off-the-beaten-path locations to avoid tourists.", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  async function handleRegenerate(refinementLabel: string, refinementText: string) {
    setIsRegenerating(refinementLabel);
    try {
      const result = await regenerateTripAction(tripId, refinementText);
      if (result.success && result.newTripId) {
        router.push(`/dashboard/trip/${result.newTripId}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRegenerating(null);
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Refine Your Architecture</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const Icon = opt.icon;
          const loading = isRegenerating === opt.label;
          return (
            <Button
              key={opt.label}
              disabled={!!isRegenerating}
              onClick={() => handleRegenerate(opt.label, opt.refinement)}
              className={cn(
                "h-20 rounded-[1.5rem] border-2 border-transparent transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center gap-1 shadow-sm",
                opt.bg, opt.color,
                loading && "animate-pulse border-indigo-200"
              )}
              variant="ghost"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Icon className="w-6 h-6" />
              )}
              <span className="text-xs font-black uppercase tracking-wider">{opt.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

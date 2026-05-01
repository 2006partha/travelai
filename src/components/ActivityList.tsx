"use client";

import { useState } from "react";
import { Clock, DollarSign, Star, MapPin, ArrowDownUp } from "lucide-react";
import { calculateDistance } from "@/lib/distance";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  time: string;
  title: string;
  description: string | null;
  estimatedCost: number;
  lat: number | null;
  lng: number | null;
  rating: number | null;
  category: string | null;
}

export function ActivityList({ activities }: { activities: Activity[] }) {
  const [sortBy, setSortBy] = useState<"time" | "cost" | "rating">("time");

  const sortedActivities = [...activities].sort((a, b) => {
    if (sortBy === "cost") return a.estimatedCost - b.estimatedCost;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0; // Default to original order (time)
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
          <ArrowDownUp className="w-3.5 h-3.5" /> Sort Daily Plan
        </div>
        <div className="flex gap-2">
          {["time", "cost", "rating"].map((type) => (
            <button
              key={type}
              onClick={() => setSortBy(type as any)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                sortBy === type 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {sortedActivities.map((activity, idx) => {
          const nextActivity = sortedActivities[idx + 1];
          const distance = (activity.lat && activity.lng && nextActivity?.lat && nextActivity?.lng)
            ? calculateDistance(activity.lat, activity.lng, nextActivity.lat, nextActivity.lng)
            : null;

          return (
            <div key={activity.id} className="relative">
              <div className="relative pl-8 border-l-2 border-indigo-100 py-2 group hover:border-indigo-400 transition-all">
                <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-white border-2 border-indigo-200 group-hover:border-indigo-500 transition-all" />
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-100 group-hover:shadow-luxury-lg transition-all">
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-wider">
                        <Clock className="w-3 h-3" /> {activity.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-wider">
                        <DollarSign className="w-3 h-3" /> ${activity.estimatedCost}
                      </span>
                      {activity.category && (
                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest">
                          {activity.category}
                        </span>
                      )}
                      {activity.rating && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                          <Star className="w-3 h-3 fill-amber-600" /> {activity.rating}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-black text-2xl text-slate-900 tracking-tight">{activity.title}</h4>
                    {activity.description && (
                      <p className="text-slate-500 text-lg leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all duration-500">{activity.description}</p>
                    )}
                  </div>
                </div>

                {distance && (
                  <div className="absolute -left-[1px] bottom-[-2rem] z-10 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">~{distance} km to next spot</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

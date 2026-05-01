"use client";

import { useState } from "react";
import { updateTripStatusAction } from "@/app/actions/trip";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { CheckCircle2, Circle, XCircle, Save, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TripStatusManager({ tripId, initialStatus, initialNotes }: { tripId: string, initialStatus: string, initialNotes?: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showNotes, setShowNotes] = useState(!!initialNotes);

  const statuses = [
    { value: "UPCOMING", label: "Upcoming", icon: Circle, color: "text-blue-500", bg: "bg-blue-50" },
    { value: "COMPLETED", label: "Executed", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateTripStatusAction(tripId, status, notes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => {
            const Icon = s.icon;
            const isSelected = status === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all border-2",
                  isSelected 
                    ? cn("border-transparent shadow-lg scale-105", s.bg, s.color) 
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                )}
              >
                <Icon className="w-4 h-4" />
                {s.label}
              </button>
            );
          })}
        </div>
        
        <Button 
          onClick={() => setShowNotes(!showNotes)}
          variant="ghost"
          className="text-slate-500 font-bold flex gap-2 hover:bg-slate-100 rounded-xl"
        >
          <MessageSquare className="w-4 h-4" /> {showNotes ? "Hide Notes" : "Add Notes / Issues"}
        </Button>
      </div>

      {showNotes && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <Label className="text-slate-800 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
            Trip Journal & Issues Faced <AlertCircle className="w-3 h-3 text-indigo-500" />
          </Label>
          <Textarea 
            placeholder="Document any issues faced, hidden gems found, or personal reflections..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-900 rounded-2xl font-bold p-6 transition-all"
          />
        </div>
      )}

      <Button 
        disabled={isSaving}
        onClick={handleSave}
        className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-slate-100 transition-all flex gap-3 disabled:opacity-50"
      >
        {isSaving ? "Syncing..." : <><Save className="w-5 h-5" /> Save Trip Log</>}
      </Button>
    </div>
  );
}

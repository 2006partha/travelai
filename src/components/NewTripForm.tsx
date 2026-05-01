"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createDetailedItinerary } from "@/app/actions/itinerary";
import { MapPin, Calendar, CreditCard, Sparkles, Wand2, ShieldCheck, Globe2, Users, Loader2, AlertCircle } from "lucide-react";

interface Props {
  user: { id: string; email: string; preferredBudget?: string | null; preferredInterests?: string[] };
  prefilledDestination?: string;
}

export function NewTripForm({ user, prefilledDestination = "" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    const payload = {
      destination: formData.get("destination") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      budget: formData.get("budget") as string,
      numberOfPeople: parseInt(formData.get("numberOfPeople") as string) || 1,
      interests: user.preferredInterests || [],
      userId: user.id,
      userEmail: user.email,
      savePreferences: formData.get("savePreferences") === "on",
    };

    startTransition(async () => {
      try {
        await createDetailedItinerary(payload);
        router.push("/dashboard");
      } catch (err: any) {
        if (err.message?.includes("NEXT_REDIRECT")) {
          router.push("/dashboard");
          return;
        }
        setError(err.message || "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900 font-sans relative overflow-hidden flex items-start justify-center">
      {/* Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] p-16 shadow-luxury-2xl flex flex-col items-center gap-8 max-w-md text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-slate-900">Crafting Your Journey</h2>
              <p className="text-slate-500 font-medium">Our AI is designing a personalized itinerary. This may take 30-60 seconds...</p>
            </div>
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-100/40 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-100/30 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="max-w-6xl w-full z-10 relative space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Planner</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">
              Architect Your <br />
              <span className="text-indigo-600">New Journey</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl">Forge a perfectly balanced itinerary tailored by intelligence.</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="font-black">Generation Failed</p>
              <p className="font-medium text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <Card className="bg-white border-none shadow-luxury-2xl rounded-[3rem] overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    {/* Destination */}
                    <div className="space-y-4 md:col-span-2">
                      <Label htmlFor="destination" className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Where to?</Label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <Input id="destination" name="destination" required defaultValue={prefilledDestination} placeholder="e.g. Kyoto, Japan or Paris, France" className="pl-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-900 h-16 rounded-2xl font-bold text-lg transition-all" />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                      <Label htmlFor="startDate" className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Departure</Label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <Input id="startDate" name="startDate" type="date" required className="pl-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-900 h-16 rounded-2xl font-bold transition-all" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="endDate" className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Return</Label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <Input id="endDate" name="endDate" type="date" required className="pl-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-900 h-16 rounded-2xl font-bold transition-all" />
                      </div>
                    </div>

                    {/* Number of People */}
                    <div className="space-y-4">
                      <Label htmlFor="numberOfPeople" className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Group Size</Label>
                      <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <Input id="numberOfPeople" name="numberOfPeople" type="number" required min={1} defaultValue={1} className="pl-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-900 h-16 rounded-2xl font-bold text-lg transition-all" />
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-4">
                      <Label htmlFor="budget" className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Budget Style</Label>
                      <div className="relative group">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <Input id="budget" name="budget" required defaultValue={user.preferredBudget || ""} placeholder="e.g. $2000 total" className="pl-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-900 h-16 rounded-2xl font-bold text-lg transition-all" />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 mt-2">
                        <input type="checkbox" id="savePreferences" name="savePreferences" className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 bg-white" />
                        <Label htmlFor="savePreferences" className="text-slate-700 font-bold cursor-pointer text-sm">Save this budget as my default for future AI drafts</Label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-20 text-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black transition-all rounded-[2.5rem] shadow-2xl shadow-slate-200 hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {isPending ? (
                      <><Loader2 className="w-7 h-7 animate-spin" /> Generating...</>
                    ) : (
                      <><Wand2 className="w-7 h-7" /> Architect Journey</>
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Tips */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
              <h3 className="text-2xl font-black mb-6 relative z-10">AI Advantage</h3>
              <ul className="space-y-6 relative z-10">
                {[
                  { icon: Globe2, title: "Hyper-Local Data", desc: "Access hidden gems known only to locals." },
                  { icon: ShieldCheck, title: "Optimized Flow", desc: "Minimize travel time between locations." },
                  { icon: Sparkles, title: "Unique to You", desc: "Every draft is uniquely built from scratch." }
                ].map((tip, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="bg-white/10 p-2 rounded-xl h-fit">
                      <tip.icon className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-sm">{tip.title}</p>
                      <p className="text-indigo-200 text-xs font-medium leading-relaxed">{tip.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="border-none bg-white shadow-luxury-lg rounded-[2.5rem] p-8 space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Quick Tip</p>
              <p className="text-slate-600 font-bold leading-relaxed">
                "Try being specific with your destination. Instead of just 'Japan', try 'Kyoto' for a more immersive and detailed itinerary."
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

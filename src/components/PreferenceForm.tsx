"use client";

import { useState } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, CreditCard, Save, Sparkles, Check, Phone, Calendar, AlignLeft } from "lucide-react";

import { cn } from "@/lib/utils";

const PREDEFINED_INTERESTS = [
  "Adventure", "Culture", "Relaxation", "Nightlife", "Shopping", 
  "Nature", "History", "Foodie", "Luxury", "Photography", 
  "Hiking", "Museums", "Beach", "Architecture", "Wellness"
];

export function PreferenceForm({ user }: { user: any }) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.preferredInterests || []);
  const [isSaving, setIsSaving] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    // Add interests to formData
    selectedInterests.forEach(i => formData.append("interests", i));
    
    try {
      await updateProfileAction(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-8">
        {/* Name Input */}
        <div className="space-y-4">
          <Label className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Full Name</Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input 
              name="name" 
              defaultValue={user.name || ""} 
              className="pl-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-900 h-16 rounded-2xl font-bold text-lg transition-all" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phone Input */}
          <div className="space-y-4">
            <Label className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Phone Number</Label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <Input 
                name="phone" 
                defaultValue={user.phone || ""} 
                placeholder="+1..." 
                className="pl-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-900 h-16 rounded-2xl font-bold text-lg transition-all" 
              />
            </div>
          </div>

          {/* Age Input */}
          <div className="space-y-4">
            <Label className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Your Age</Label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <Input 
                name="age" 
                type="number"
                defaultValue={user.age || ""} 
                className="pl-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-900 h-16 rounded-2xl font-bold text-lg transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Bio Input */}
        <div className="space-y-4">
          <Label className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Traveler Bio</Label>
          <div className="relative group">
            <AlignLeft className="absolute left-4 top-6 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <textarea 
              name="bio" 
              defaultValue={user.bio || ""} 
              placeholder="Tell AI about your travel style..."
              className="w-full pl-12 pt-5 pb-5 bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 min-h-[120px] rounded-2xl font-bold text-lg transition-all resize-none outline-none" 
            />
          </div>
        </div>

        {/* Budget Input */}
        <div className="space-y-4">
          <Label className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Budget Style</Label>
          <div className="relative group">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input 
              name="preferredBudget" 
              defaultValue={user.preferredBudget || ""} 
              placeholder="e.g. Luxury, Backpacker, Moderate" 
              className="pl-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-900 h-16 rounded-2xl font-bold text-lg transition-all" 
            />
          </div>
        </div>

        {/* Interests Selection */}
        <div className="space-y-4">
          <Label className="text-slate-800 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
            Interests & Vibe <Sparkles className="w-3 h-3 text-indigo-500" />
          </Label>
          <div className="flex flex-wrap gap-2 pt-2">
            {PREDEFINED_INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    "px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 border-2",
                    isSelected 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-indigo-200"
                  )}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : null}
                  {interest}
                </button>
              );
            })}
          </div>
          <p className="text-slate-400 text-sm font-medium pt-2 italic">Select the things that make your heart race.</p>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSaving}
        className="w-full h-20 text-xl bg-slate-900 hover:bg-indigo-600 text-white font-black transition-all rounded-[2.5rem] shadow-2xl shadow-slate-200 hover:scale-[1.02] flex gap-3 disabled:opacity-50"
      >
        {isSaving ? "Saving..." : <><Save className="w-6 h-6" /> Save Preferences</>}
      </Button>
    </form>
  );
}

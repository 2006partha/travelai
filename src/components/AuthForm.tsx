"use client";

import { loginAction, signInWithGoogle } from "@/app/actions/auth";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, Mail, Sparkles, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

export function AuthForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await loginAction(formData);
      } catch (err: any) {
        if (err.message.includes("NEXT_REDIRECT")) return;
        setError(err.message || "Something went wrong");
      }
    });
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-indigo-600 shadow-xl shadow-indigo-200 mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Travel Architecture</h1>
        <p className="text-slate-500 font-bold">Quick access to your intelligent itineraries.</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-luxury-2xl border border-slate-100">
        <form action={handleAction} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input name="name" placeholder="John Doe" required className="pl-12 h-12 rounded-xl bg-slate-50 border-none font-bold" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input name="email" type="email" placeholder="architect@example.com" required className="pl-12 h-12 rounded-xl bg-slate-50 border-none font-bold" />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-bold animate-in shake-2 duration-500">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isPending} 
            className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Exploring"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">
            <span className="bg-white px-4">Social Sync</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => signInWithGoogle()}
          className="w-full h-14 border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/30 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

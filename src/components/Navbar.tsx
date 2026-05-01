"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, User, Compass, LayoutDashboard, Plus, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";
import { useEffect, useState } from "react";

export function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Explore", href: "/", icon: Compass },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Trip", href: "/new", icon: Plus, highlight: true },
  ];

  return (
    <nav className={cn(
      "fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-500",
      scrolled ? "top-4 scale-[0.98]" : "top-6 scale-100"
    )}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-rose-500/20 blur-3xl -z-10 opacity-50" />
      
      <div className="relative bg-white/80 backdrop-blur-3xl border border-white/40 shadow-luxury-2xl rounded-[2.5rem] px-6 py-3 flex items-center justify-between group overflow-hidden">
        {/* Animated Border Glow */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group/logo">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-0 group-hover/logo:opacity-40 transition-opacity" />
            <div className="relative bg-slate-900 p-2.5 rounded-2xl shadow-xl group-hover/logo:scale-110 group-hover/logo:rotate-3 transition-all duration-500">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-black tracking-tighter text-slate-900">TravelAI</span>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Architect</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50/50 p-1.5 rounded-[2rem] border border-slate-100/50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all relative group/link",
                  isActive 
                    ? "bg-white text-indigo-600 shadow-luxury-sm" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
                )}>
                  <Icon className={cn("w-4 h-4 transition-transform group-hover/link:scale-110", isActive && "text-indigo-600")} />
                  {link.name}
                  {link.highlight && !isActive && (
                    <Sparkles className="w-3 h-3 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <div className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all overflow-hidden group/avatar",
                  pathname === "/profile" 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-luxury-sm" 
                    : "border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-300 hover:shadow-lg"
                )}>
                   <User className="w-5 h-5 group-hover/avatar:scale-110 transition-transform" />
                </div>
              </Link>
              <form action={logoutAction} className="hidden sm:block">
                <Button type="submit" variant="ghost" size="sm" className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-bold h-11 w-11 p-0 rounded-2xl transition-all">
                  <LogOut className="w-5 h-5" />
                </Button>
              </form>

            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl px-8 h-12 shadow-xl shadow-slate-200 hover:shadow-indigo-100 transition-all hover:scale-105 active:scale-95">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}


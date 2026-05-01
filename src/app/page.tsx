import { getSuggestedTrips, getTrendingSeasonalTrip } from "@/app/actions/suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { fetchDestinationImage, getPlaceholderGradient } from "@/lib/images";

import { Flame, Sparkles, MapPin, Heart, Compass, CreditCard, ChevronRight } from "lucide-react";

export default async function Home() {
  const [suggestionsRaw, trendingTripsRaw] = await Promise.all([
    getSuggestedTrips(),
    getTrendingSeasonalTrip()
  ]);

  const [suggestions, trendingTrips] = await Promise.all([
    Promise.all((suggestionsRaw || []).map(async (s) => ({ ...s, image: await fetchDestinationImage(s.destination, { category: "romantic" }) }))),
    Promise.all((trendingTripsRaw || []).map(async (t) => ({ ...t, image: await fetchDestinationImage(t.destination, { category: "adventure" }) })))
  ]);

  return (
    <div className="flex flex-col text-slate-900 font-sans relative overflow-hidden bg-slate-50">
      {/* Ambient Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-100/40 blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-100/30 blur-[150px] pointer-events-none rounded-full" />

      <main className="relative z-10 w-full max-w-7xl mx-auto flex-1 px-6 md:px-12">

        {/* HERO SECTION */}
        <div className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center">
          <div className="inline-block mb-10 px-6 py-2 rounded-full bg-white border border-slate-200 shadow-luxury-sm">
            <span className="text-indigo-600 font-black text-xs tracking-[0.3em] uppercase">The Future of Exploration</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 text-slate-900 leading-[0.9]">
            Architect Your <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-transparent bg-clip-text">Next Journey</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium mb-16 leading-relaxed">
            Say goodbye to stressful planning. Our intelligent AI engine crafts perfectly balanced, highly personalized itineraries in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
            <Link href="/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-20 px-12 text-xl font-black rounded-[2rem] bg-slate-900 hover:bg-indigo-600 text-white shadow-luxury-2xl hover:scale-105 transition-all flex gap-3">
                Start Planning <Compass className="w-6 h-6" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-20 px-12 text-xl border-2 border-slate-200 font-black rounded-[2rem] hover:bg-white hover:border-slate-900 transition-all">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>


        {/* HOW IT WORKS SECTION */}
        <div className="py-32 border-t border-slate-100 relative">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">How <span className="text-indigo-600">TravelAI</span> Works</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">Three simple steps to unlock a fully personalized adventure architected by artificial intelligence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Sparkles, title: "1. Tell us your vibe", desc: "Input your destination, budget, and specific interests. The more details you provide, the better the experience.", color: "bg-amber-50 text-amber-600" },
              { icon: Heart, title: "2. Smart Budgeting", desc: "Whether you're looking for luxury or a backpacker experience, our engine optimizes daily costs to match your goal.", color: "bg-rose-50 text-rose-600" },
              { icon: MapPin, title: "3. Hidden Gems", desc: "Go beyond the tourist traps. Discover local favorites, unique dining, and experiences off the beaten path.", color: "bg-indigo-50 text-indigo-600" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Card key={i} className="p-10 rounded-[2.5rem] border-none bg-white shadow-luxury-lg hover:shadow-luxury-2xl transition-all duration-500 group">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{item.title}</h3>
                  <p className="text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>


        {/* TRENDING SEASONAL TRIPS */}
        {trendingTrips.length > 0 && (
          <div className="py-32 border-t border-slate-100 relative">
            <div className="mb-20 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                <Flame className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Trending Now</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">Seasonal <span className="text-rose-600">Spotlights</span></h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Our AI analyzes global travel trends to find the perfect destinations for this time of year.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {trendingTrips.map((trip, i) => (
                <Card key={i} className="h-full bg-white border-none shadow-luxury-lg hover:shadow-luxury-2xl rounded-[2.5rem] overflow-hidden transition-all duration-500 flex flex-col group">
                  <div className="relative h-64 overflow-hidden">
                    {trip.image ? (
                      <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getPlaceholderGradient(trip.destination)} flex items-center justify-center`}>
                        <span className="text-white text-5xl font-black opacity-30">{trip.destination.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/20">
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                          <CreditCard className="w-3 h-3 text-rose-600" /> {trip.estimatedBudget}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-6">
                      <p className="text-white font-black text-2xl tracking-tight drop-shadow-lg">
                        {trip.destination}
                      </p>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 flex flex-col flex-1">
                    <p className="text-slate-500 font-bold leading-relaxed mb-6 line-clamp-2">
                      {trip.description}
                    </p>
                    
                    <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100/50 mb-8 mt-auto">
                      <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-3">Seasonal Intel</p>
                      <p className="text-sm text-slate-700 font-bold leading-snug">{trip.whyNow}</p>
                    </div>

                    <Link href={`/new?destination=${encodeURIComponent(trip.destination)}`} className="block">
                      <Button className="w-full h-16 bg-slate-900 hover:bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-slate-100 transition-all flex gap-3">
                        Architect Trip <ChevronRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}


        {/* CURATED SUGGESTIONS */}
        <div className="py-32 border-t border-slate-100 relative mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Personalized for you</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">AI Curated <span className="text-indigo-600">Journeys</span></h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">Based on your unique profile preferences, we've architected these destinations specifically for your taste.</p>
            </div>
            {suggestions.length > 0 && (
              <Link href="/profile">
                <Button variant="ghost" className="text-slate-500 hover:text-indigo-600 font-bold hidden md:flex items-center gap-2">
                  Refine Preferences <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          {suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white border-2 border-slate-100 border-dashed rounded-[3rem] text-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 relative z-10">
                <Heart className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 relative z-10">Help us know you better</h3>
              <p className="text-slate-500 mb-10 max-w-md font-medium text-lg leading-relaxed relative z-10">We need a few details about your travel style to generate these personalized suggestions for you.</p>
              <Link href="/profile" className="relative z-10">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl px-12 py-7 h-auto text-xl shadow-2xl shadow-indigo-100 hover:scale-105 transition-all">
                  Set Preferences ✨
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {suggestions.map((s, i) => (
                <Card key={i} className="h-full bg-white border-none shadow-luxury-lg hover:shadow-luxury-2xl rounded-[2.5rem] overflow-hidden transition-all duration-500 flex flex-col group">
                  <div className="relative h-64 overflow-hidden">
                    {s.image ? (
                      <img src={s.image} alt={s.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getPlaceholderGradient(s.destination)} flex items-center justify-center`}>
                        <span className="text-white text-5xl font-black opacity-30">{s.destination.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/20">
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                          <CreditCard className="w-3 h-3 text-indigo-600" /> {s.estimatedBudget}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-6">
                      <p className="text-white font-black text-2xl tracking-tight drop-shadow-lg">
                        {s.destination}
                      </p>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 flex flex-col flex-1">
                    <p className="text-slate-500 font-bold leading-relaxed mb-6 line-clamp-2">
                      {s.description}
                    </p>
                    
                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 mb-8 mt-auto">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Expert Insight</p>
                      <p className="text-sm text-slate-700 font-bold leading-snug">{s.reasonToVisit}</p>
                    </div>

                    <Link href={`/new?destination=${encodeURIComponent(s.destination)}`} className="block">
                      <Button className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-slate-100 transition-all flex gap-3">
                        Plan Journey <ChevronRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm py-8 mt-auto">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            © 2026 TravelAI. Crafted with <Compass className="w-4 h-4 inline text-yellow-600 mx-1" /> for explorers everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}


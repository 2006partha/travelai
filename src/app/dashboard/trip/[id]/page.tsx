import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { BookingLinksClient } from "@/components/BookingLinksClient";
import { MailButtonClient } from "@/components/MailButtonClient";
import { fetchDestinationImage } from "@/lib/images";
import { MapPin, Calendar, CreditCard, ChevronLeft, Clock, DollarSign, Image as ImageIcon, Luggage, Sparkles, CheckCircle2, History, Bed, Utensils, Star, Route } from "lucide-react";
import { TripStatusManager } from "@/components/TripStatusManager";
import { TripRefinementButtons } from "@/components/TripRefinementButtons";
import TripMapClient from "@/components/TripMapClient";
import { ActivityList } from "@/components/ActivityList";
import ReactMarkdown from "react-markdown";







export default async function TripDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const user = await getAuthUser();

  if (!user) redirect("/login");

  const trip = await prisma.trip.findFirst({
    where: { id: params.id, users: { some: { id: user.id } } },
    include: {
      days: {
        include: { activities: true },
        orderBy: { index: "asc" }
      }
    }
  });

  if (!trip) return <div className="p-20 text-center text-xl text-slate-500 font-medium">Trip not found.</div>;

  // Fetch Hero Image
  const heroImage = await fetchDestinationImage(trip.destination, { width: 1600, quality: 85 });

  // Fetch images for each activity (optional enhancement)
  // To avoid hitting rate limits too hard, we fetch them in parallel but only for the first few activities or use a simpler placeholder logic
  // For now, let's try to fetch one image per day's first activity to keep it clean and fast
  const dayImages = await Promise.all(
    trip.days.map(async (day) => {
      const firstActivity = day.activities[0];
      if (firstActivity) {
        return {
          dayId: day.id,
          image: await fetchDestinationImage(`${trip.destination} ${firstActivity.title}`, { width: 400, category: "adventure" })
        };
      }
      return null;
    })
  );

  const dayImageMap = Object.fromEntries(
    dayImages.filter(Boolean).map(item => [item!.dayId, item!.image])
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <img 
          src={heroImage} 
          alt={trip.destination} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-12 left-8 md:left-16 right-8 z-10 space-y-6">

          <div className="flex flex-wrap gap-3">
             <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em]">
               {trip.budget} Budget
             </span>
             <span className="bg-indigo-600/80 backdrop-blur-md text-white font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] shadow-lg">
               {trip.days.length} Day Journey
             </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl max-w-4xl">
            {trip.title}
          </h1>
          <div className="flex items-center gap-4 text-white/90 font-bold text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>{trip.destination}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>{format(new Date(trip.startDate), 'MMMM dd')} — {format(new Date(trip.endDate), 'MMMM dd, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-10 relative z-20">
        <div className="flex justify-end mb-8">
           <MailButtonClient tripId={trip.id} />
        </div>

        <Card className="bg-white border-none shadow-luxury-2xl rounded-[3rem] overflow-hidden">
          <CardContent className="p-8 md:p-12 space-y-16">
            
            {/* Packing List Section */}
            {trip.packingList && (
              <div className="bg-indigo-50/50 rounded-[2.5rem] p-8 md:p-12 border border-indigo-100/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-colors" />
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-indigo-600 border border-indigo-100 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Curated by AI</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Luggage className="w-8 h-8 text-indigo-600" /> Packing Essentials
                      </h2>
                      <p className="text-slate-500 font-bold">Specifically architected for {trip.destination} in {format(new Date(trip.startDate), 'MMMM')}.</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-slate prose-lg max-w-none 
                    prose-headings:text-slate-800 prose-headings:font-black prose-headings:tracking-tight prose-headings:mb-4
                    prose-ul:grid prose-ul:grid-cols-1 md:prose-ul:grid-cols-2 prose-ul:gap-x-12 prose-ul:gap-y-2 prose-ul:list-none prose-ul:pl-0
                    prose-li:flex prose-li:items-start prose-li:gap-3 prose-li:text-slate-600 prose-li:font-bold
                    prose-li:before:content-['✓'] prose-li:before:text-indigo-600 prose-li:before:font-black prose-li:before:text-lg
                  ">
                    <ReactMarkdown>{trip.packingList}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Map Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Route className="w-8 h-8 text-indigo-600" />
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Interactive Journey Map</h2>
              </div>
              <TripMapClient days={trip.days} />

            </div>

            {/* Plan Refinement */}
            <TripRefinementButtons tripId={trip.id} />

            {/* Trip Log & Execution Section */}
            <div className="bg-slate-50/80 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <History className="w-8 h-8 text-slate-600" /> Trip Log & Execution
                  </h2>
                  <p className="text-slate-500 font-bold">Track if this journey was executed and document any issues or hidden gems found.</p>
                </div>
                
                <TripStatusManager 
                  tripId={trip.id} 
                  initialStatus={trip.status} 
                  initialNotes={trip.notes || ""} 
                />
              </div>
            </div>
            
            {/* Daily Itinerary */}
            {trip.days.map((day: any) => (
              <div key={day.id} className="space-y-12 pt-16 border-t border-slate-100 first:border-t-0 first:pt-0">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <p className="text-indigo-600 font-black text-sm uppercase tracking-[0.3em]">Day {day.index}</p>
                    <h3 className="font-black text-4xl text-slate-900 tracking-tight">
                      {format(new Date(day.date), 'EEEE, MMMM dd')}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {day.accommodation && (
                      <div className="bg-indigo-50 px-5 py-3 rounded-2xl flex items-center gap-3 border border-indigo-100 shadow-sm">
                        <Bed className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Recommended Stay</p>
                          <p className="text-sm font-black text-slate-800">{day.accommodation}</p>
                        </div>
                      </div>
                    )}
                    {day.foodSuggestions && (
                      <div className="bg-emerald-50 px-5 py-3 rounded-2xl flex items-center gap-3 border border-emerald-100 shadow-sm">
                        <Utensils className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Local Eats</p>
                          <p className="text-sm font-black text-slate-800 truncate max-w-[150px]">{day.foodSuggestions}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Day Highlight Image */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="rounded-[2.5rem] overflow-hidden shadow-luxury-lg h-64 lg:h-96 relative group">
                      <img 
                        src={dayImageMap[day.id] || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80"} 
                        alt={`Day ${day.index}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                         <p className="text-white text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 inline-block mb-2">Visual Highlight</p>
                         <h4 className="text-white text-2xl font-black">{day.theme}</h4>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                       <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Day Overview</h5>
                       <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-bold text-sm">Activities</span>
                          <span className="text-slate-900 font-black">{day.activities.length} Spots</span>
                       </div>
                    </div>
                  </div>

                  {/* Sortable Activities List */}
                  <div className="lg:col-span-8">
                    <ActivityList activities={day.activities} />
                  </div>
                </div>
              </div>
            ))}


            <div className="pt-12 border-t border-slate-100">

              <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full" />
                <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black tracking-tight">Ready for your adventure?</h3>
                    <p className="text-indigo-200 text-lg font-medium max-w-xl">We've generated these booking links to help you finalize your trip details instantly.</p>
                  </div>
                  <BookingLinksClient 
                    destination={trip.destination} 
                    startDate={format(new Date(trip.startDate), 'yyyy-MM-dd')} 
                    endDate={format(new Date(trip.endDate), 'yyyy-MM-dd')} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


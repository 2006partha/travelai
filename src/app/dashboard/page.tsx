import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAuthUser, logoutAction } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { fetchDestinationImage } from "@/lib/images";
import { MapPin, Calendar, CreditCard, ChevronRight, Plus, LogOut, Home } from "lucide-react";
import { cn } from "@/lib/utils";


export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  let trips: any[] = [];
  try {
    const rawTrips = await prisma.trip.findMany({
      where: { users: { some: { id: user.id } } },
      orderBy: { createdAt: "desc" }
    });

    // Fetch images for each trip in parallel
    trips = await Promise.all(
      rawTrips.map(async (trip) => ({
        ...trip,
        image: await fetchDestinationImage(trip.destination, { width: 600, quality: 75 })
      }))
    );
  } catch (error) {
    console.error("Failed to fetch trips or images.", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden pb-20">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-100/40 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/30 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 space-y-12 relative z-10">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium">You have {trips.length} curated journeys waiting for you.</p>
        </div>


        <div className="space-y-20 pb-20">
          {/* UPCOMING JOURNEYS */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full" />
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Upcoming Journeys</h3>
            </div>
            
            {trips.filter(t => t.status === "UPCOMING").length === 0 ? (
              <div className="p-12 border-2 border-slate-100 border-dashed rounded-[2.5rem] text-center bg-white/40">
                <p className="text-slate-400 font-bold">No upcoming journeys architected yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {trips.filter(t => t.status === "UPCOMING").map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </div>

          {/* PAST JOURNEYS */}
          {trips.filter(t => t.status !== "UPCOMING").length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-slate-400 rounded-full" />
                <h3 className="text-3xl font-black text-slate-400 tracking-tight">Past Journeys</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {trips.filter(t => t.status !== "UPCOMING").map((trip) => (
                  <TripCard key={trip.id} trip={trip} opacity="opacity-75 grayscale-[0.2]" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip, opacity = "" }: { trip: any, opacity?: string }) {
  const statusColors: any = {
    UPCOMING: "bg-blue-50 text-blue-600",
    COMPLETED: "bg-emerald-50 text-emerald-600",
    CANCELLED: "bg-rose-50 text-rose-600",
  };

  return (
    <Link href={`/dashboard/trip/${trip.id}`} className={cn("group block h-full", opacity)}>
      <Card className="h-full bg-white border-none shadow-luxury-lg hover:shadow-luxury-2xl rounded-[2.5rem] overflow-hidden transition-all duration-500 flex flex-col">
        {/* Card Image Header */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={trip.image} 
            alt={trip.destination} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          <div className="absolute top-4 left-4">
            <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/20 backdrop-blur-md", statusColors[trip.status])}>
              {trip.status === "UPCOMING" ? "Planned" : trip.status === "COMPLETED" ? "Executed" : "Cancelled"}
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/20">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <CreditCard className="w-3 h-3 text-indigo-600" /> {trip.budget}
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
          <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {trip.title}
          </h3>
          
          <div className="flex flex-col gap-3 mt-auto">
            <div className="flex items-center gap-3 text-slate-500 font-bold text-xs bg-slate-50 p-4 rounded-2xl">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>
                {format(new Date(trip.startDate), 'MMM dd')} — {format(new Date(trip.endDate), 'MMM dd, yyyy')}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Explore Details</span>
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}



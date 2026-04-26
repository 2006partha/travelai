import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { BookingLinksClient } from "@/components/BookingLinksClient";
import { MailButtonClient } from "@/components/MailButtonClient";

export default async function TripDetailsPage({ params }: { params: { id: string } }) {
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900 font-sans relative overflow-hidden">
      {/* Colorful lively backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/50 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-200/50 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-rose-200/40 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        <div className="flex justify-between items-center border-b border-slate-200 pb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-800 hover:bg-slate-200/50">← Back to Dashboard</Button>
          </Link>
          <div className="flex items-center gap-3">
             <MailButtonClient tripId={trip.id} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 tracking-tight">
            {trip.title}
          </h1>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="bg-blue-100 text-blue-700 font-semibold px-4 py-1.5 rounded-full shadow-sm">{trip.destination}</span>
            <span className="bg-emerald-100 text-emerald-700 font-semibold px-4 py-1.5 rounded-full shadow-sm">{trip.budget} Budget</span>
            <span className="bg-violet-100 text-violet-700 font-semibold px-4 py-1.5 rounded-full shadow-sm">
              {format(new Date(trip.startDate), 'MMM dd')} — {format(new Date(trip.endDate), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border-white shadow-xl shadow-slate-200/50 overflow-hidden">
          <CardContent className="p-8 space-y-10">
            {trip.days.map((day: any) => (
              <div key={day.id} className="relative pl-8 before:absolute before:left-3 before:top-4 before:bottom-0 before:w-px before:bg-slate-200 last:before:hidden">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <h3 className="font-extrabold text-2xl text-slate-800 mb-6 flex items-center">
                  Day {day.index} <span className="text-slate-400 ml-3 font-semibold text-lg">{format(new Date(day.date), 'EEEE, MMMM dd')}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {day.activities.map((activity: any) => (
                    <div key={activity.id} className="bg-white border border-slate-100 p-6 rounded-2xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all group">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-blue-600 font-bold text-sm tracking-widest uppercase bg-blue-50 inline-block px-3 py-1 rounded-full mb-3 border border-blue-100">
                            {activity.time}
                          </p>
                          <p className="font-bold text-slate-800 text-xl leading-tight">{activity.title}</p>
                          {activity.description && (
                            <p className="text-slate-500 text-base mt-3 leading-relaxed">{activity.description}</p>
                          )}
                        </div>
                        <div className="ml-4 shrink-0 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 font-bold text-emerald-600 shadow-sm">
                          ${activity.estimatedCost}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-8 border-t border-slate-200 mt-8">
              <BookingLinksClient 
                destination={trip.destination} 
                startDate={format(new Date(trip.startDate), 'yyyy-MM-dd')} 
                endDate={format(new Date(trip.endDate), 'yyyy-MM-dd')} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

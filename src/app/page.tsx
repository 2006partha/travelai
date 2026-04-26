import { getAuthUser, logoutAction } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getSuggestedTrips } from "@/app/actions/suggestions";

export default async function Home() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const suggestions = await getSuggestedTrips();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 text-slate-900 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/50 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-200/50 blur-[120px] pointer-events-none rounded-full" />

      <nav className="relative z-10 w-full max-w-6xl mx-auto flex justify-between items-center py-6 border-b border-slate-200 mb-12">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold bg-gradient-to-br from-indigo-500 to-rose-500 text-transparent bg-clip-text">TravelAI</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-slate-500 hidden md:block">Welcome, <span className="text-slate-800 font-bold">{user.name}</span></span>
          <Link href="/new">
             <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">Build Itinerary</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl">Dashboard</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl">Profile</Button>
          </Link>
          <form action={logoutAction}>
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 font-semibold">Logout</Button>
          </form>
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-6xl mx-auto flex-1">
        <div className="text-center mb-16 mt-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-800">
            Discover Your Next <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500 text-transparent bg-clip-text">Adventure</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Based on your profile, our AI has curated these incredible destinations just for you.
          </p>
        </div>

        {suggestions.length === 0 ? (
          <div className="text-center p-12 bg-white/50 rounded-3xl border border-slate-200 shadow-sm backdrop-blur-sm">
             <p className="text-slate-500 mb-6 text-lg font-medium">We need a bit more info to give you personalized suggestions.</p>
             <Link href="/profile">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-8 py-6 h-auto text-lg">Update Profile Preferences</Button>
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {suggestions.map((s, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-xl border-white flex flex-col hover:border-indigo-300 transition-all hover:shadow-xl hover:-translate-y-1 shadow-md group rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                  <CardTitle className="text-2xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.destination}</CardTitle>
                  <CardDescription className="text-emerald-600 font-bold uppercase tracking-wider text-xs mt-2">{s.estimatedBudget} Budget</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between p-8 bg-white">
                  <div className="mb-6 space-y-4">
                    <p className="text-slate-600 leading-relaxed font-medium">{s.description}</p>
                    <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                      <p className="text-sm font-bold text-indigo-800 mb-2">Why you'll love it:</p>
                      <p className="text-sm text-indigo-600/80 font-medium">{s.reasonToVisit}</p>
                    </div>
                  </div>
                  <Link href={`/new?destination=${encodeURIComponent(s.destination)}`}>
                    <Button className="w-full bg-slate-800 hover:bg-indigo-600 text-white font-bold rounded-xl py-6 h-auto transition-colors">
                      Plan this trip
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

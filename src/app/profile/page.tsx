import { getAuthUser, logoutAction } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { updateProfileAction } from "@/app/actions/profile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900 font-sans relative overflow-hidden flex justify-center items-start">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-200/50 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/50 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-3xl w-full mt-12 z-10 relative">
        <div className="flex justify-between items-center mb-10 border-b border-slate-200 pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-500 to-blue-500 text-transparent bg-clip-text">
            Travel Profile
          </h1>
          <div className="flex gap-4">
            <Link href="/">
               <Button variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-xl shadow-sm">Back Home</Button>
            </Link>
            <form action={logoutAction}>
              <Button variant="ghost" className="text-slate-500 hover:text-slate-900 font-bold">Logout</Button>
            </form>
          </div>
        </div>
        
        <Card className="bg-white/90 backdrop-blur-xl border-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
            <CardTitle className="text-3xl font-extrabold text-slate-800">Your Preferences</CardTitle>
            <CardDescription className="text-slate-500 text-lg mt-2 font-medium">
              We'll use these to suggest trips and tailor itineraries specifically for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <form action={updateProfileAction} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-slate-700 font-bold text-lg">Name</Label>
                <Input name="name" defaultValue={user.name || ""} placeholder="John Doe" className="bg-slate-50 border-slate-200 text-slate-900 h-14 rounded-xl shadow-sm font-medium" />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-700 font-bold text-lg">Preferred Budget</Label>
                <Input name="preferredBudget" defaultValue={user.preferredBudget || ""} placeholder="e.g. Moderate, Luxury, Backpacker, $3000" className="bg-slate-50 border-slate-200 text-slate-900 h-14 rounded-xl shadow-sm font-medium" />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-700 font-bold text-lg">Interests & Vibes (Comma separated)</Label>
                <Textarea name="preferredInterests" defaultValue={user.preferredInterests?.join(", ") || ""} placeholder="Culture, Food, Adventure, Nightlife..." className="bg-slate-50 border-slate-200 text-slate-900 min-h-[120px] resize-none rounded-xl shadow-sm font-medium p-4" />
              </div>
              <Button type="submit" className="w-full h-16 text-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold transition-all rounded-2xl shadow-xl shadow-emerald-200 hover:scale-[1.02]">
                Save Preferences ✨
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { getAuthUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createDetailedItinerary } from "@/app/actions/itinerary";
import Link from "next/link";

export default async function NewTripPage({ searchParams }: { searchParams: { destination?: string }}) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const prefilledDestination = searchParams.destination || "";

  // Server action bridge
  async function handleSubmitAction(formData: FormData) {
    "use server";
    const interests = formData.get("interests")?.toString().split(",").map(i => i.trim()) || [];
    const savePref = formData.get("savePreferences") === "on";
    const payload = {
      destination: formData.get("destination") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      budget: formData.get("budget") as string,
      interests,
      userId: user!.id,
      userEmail: user!.email,
      savePreferences: savePref
    };

    const result = await createDetailedItinerary(payload);
    if (result) redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-slate-900 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-200/50 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-200/40 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="absolute top-8 left-8 z-20">
        <Link href="/">
          <Button variant="ghost" className="text-slate-500 hover:text-slate-900 font-bold hover:bg-slate-200/50 rounded-xl">← Back Home</Button>
        </Link>
      </div>

      <Card className="z-10 w-full max-w-3xl mt-12 bg-white/90 backdrop-blur-xl border-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
        <CardHeader className="text-center p-10 bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 text-transparent bg-clip-text">
            Architect New Journey
          </CardTitle>
          <CardDescription className="text-slate-500 text-lg mt-3 font-medium">
            Harness the power of AI to forge your perfect itinerary.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10 bg-white">
          <form action={handleSubmitAction} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="destination" className="text-slate-700 font-bold">Destination</Label>
                <Input id="destination" name="destination" required defaultValue={prefilledDestination} placeholder="e.g. Kyoto, Japan" className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-indigo-500 h-14 rounded-xl shadow-sm" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="budget" className="text-slate-700 font-bold">Budget Summary</Label>
                <Input id="budget" name="budget" required defaultValue={user.preferredBudget || ""} placeholder="e.g. $2000 or Moderate" className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-indigo-500 h-14 rounded-xl shadow-sm" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="startDate" className="text-slate-700 font-bold">Departure</Label>
                <Input id="startDate" name="startDate" type="date" required className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-indigo-500 h-14 rounded-xl shadow-sm" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="endDate" className="text-slate-700 font-bold">Return</Label>
                <Input id="endDate" name="endDate" type="date" required className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-indigo-500 h-14 rounded-xl shadow-sm" />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="interests" className="text-slate-700 font-bold">Interests & Vibes (Comma separated)</Label>
              <Textarea id="interests" name="interests" required defaultValue={user.preferredInterests?.join(", ") || ""} placeholder="Hidden gems, street food, temples, nightlife..." className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-indigo-500 min-h-[120px] resize-none rounded-xl shadow-sm p-4" />
            </div>

            <div className="flex items-center space-x-3 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
              <input type="checkbox" id="savePreferences" name="savePreferences" className="w-5 h-5 rounded border-blue-300 text-indigo-600 focus:ring-indigo-500 bg-white" />
              <Label htmlFor="savePreferences" className="text-slate-700 font-bold cursor-pointer">Save Budget & Interests as my defaults</Label>
            </div>

            <Button type="submit" className="w-full h-16 text-lg bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white font-extrabold shadow-xl shadow-indigo-200 transition-all rounded-2xl border-none hover:scale-[1.02]">
              Architect My Perfect Trip 🚀
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

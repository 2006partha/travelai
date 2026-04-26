import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-slate-900 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/60 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-200/50 blur-[120px] pointer-events-none rounded-full" />
      
      <Card className="z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
        <CardHeader className="text-center p-10 bg-slate-50 border-b border-slate-100">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-rose-200">
            <span className="text-4xl drop-shadow-md">✈️</span>
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tight text-slate-800">
            TravelAI
          </CardTitle>
          <CardDescription className="text-slate-500 text-lg mt-3 font-medium">
            Sign in to manage your AI itineraries and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10 bg-white">
          <form action={loginAction} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-slate-700 font-bold text-lg">Your Name</Label>
              <Input id="name" name="name" required placeholder="John Doe" className="bg-slate-50 border-slate-200 text-slate-900 h-14 rounded-xl shadow-sm font-medium focus-visible:ring-indigo-500" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-slate-700 font-bold text-lg">Email Address</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-slate-50 border-slate-200 text-slate-900 h-14 rounded-xl shadow-sm font-medium focus-visible:ring-indigo-500" />
            </div>
            <Button type="submit" className="w-full h-16 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold transition-all rounded-2xl shadow-xl shadow-indigo-200 hover:scale-[1.02]">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

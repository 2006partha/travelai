import { getAuthUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { PreferenceForm } from "@/components/PreferenceForm";

export default async function ProfilePage({ searchParams: searchParamsPromise }: { searchParams: Promise<{ saved?: string }> }) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const searchParams = await searchParamsPromise;
  const isSaved = searchParams.saved === "true";

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900 font-sans relative overflow-hidden flex justify-center items-start">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-100/40 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/30 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-4xl w-full z-10 relative space-y-10">
        {isSaved && (
          <div className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl shadow-emerald-200 border border-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <p className="font-black">Preferences archived successfully! AI is now recalculating your vibe.</p>
          </div>
        )}

        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">
            Profile <span className="text-indigo-600">Architect</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">Fine-tune your identity and travel aspirations.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar / Info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white border-none shadow-luxury-lg rounded-[2.5rem] p-8 text-center space-y-6 sticky top-32">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-indigo-100">
                <User className="w-10 h-10 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800">{user.name || "Explorer"}</h3>
                <p className="text-slate-500 font-medium text-sm flex items-center justify-center gap-2 truncate">
                  <Mail className="w-3 h-3" /> {user.email}
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Status</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <p className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Verified</p>
                  <p className="text-indigo-600 font-bold uppercase tracking-wider text-[10px] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                    <Sparkles className="w-2 h-2" /> Elite
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <Card className="bg-white border-none shadow-luxury-2xl rounded-[3rem] overflow-hidden">
              <CardContent className="p-8 md:p-12">
                 <PreferenceForm user={user} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}



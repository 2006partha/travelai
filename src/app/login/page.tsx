import { AuthForm } from "@/components/AuthForm";
import { getAuthUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getAuthUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <AuthForm />
    </div>
  );
}

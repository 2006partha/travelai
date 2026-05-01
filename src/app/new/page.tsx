import { getAuthUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { NewTripForm } from "@/components/NewTripForm";

export default async function NewTripPage({ searchParams: searchParamsPromise }: { searchParams: Promise<{ destination?: string }> }) {
  const searchParams = await searchParamsPromise;
  const user = await getAuthUser();
  if (!user) redirect("/login");

  return (
    <NewTripForm
      user={{
        id: user.id,
        email: user.email,
        preferredBudget: user.preferredBudget,
        preferredInterests: user.preferredInterests,
      }}
      prefilledDestination={searchParams.destination || ""}
    />
  );
}

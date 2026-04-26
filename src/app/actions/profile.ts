"use server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileAction(formData: FormData) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  
  const name = formData.get("name") as string;
  const preferredBudget = formData.get("preferredBudget") as string;
  const interestsRaw = formData.get("preferredInterests") as string;
  const preferredInterests = interestsRaw.split(",").map(i => i.trim()).filter(Boolean);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      preferredBudget,
      preferredInterests
    }
  });

  revalidatePath("/");
  revalidatePath("/profile");
  redirect("/");
}

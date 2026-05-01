"use server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileAction(formData: FormData) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const ageRaw = formData.get("age") as string;
  const age = ageRaw ? parseInt(ageRaw) : null;
  const bio = formData.get("bio") as string;
  const preferredBudget = formData.get("preferredBudget") as string;
  const preferredInterests = formData.getAll("interests") as string[];

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      phone,
      age,
      bio,
      preferredBudget,
      preferredInterests,
    }
  });


  revalidatePath("/");
  revalidatePath("/profile");
  redirect("/profile?saved=true");
}


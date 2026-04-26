"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  if (!email) return;

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });

  const cookieStore = await cookies();
  cookieStore.set("travel_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("travel_session");
  redirect("/login");
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("travel_session")?.value;
  if (!userId) return null;

  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (err) {
    return null;
  }
}

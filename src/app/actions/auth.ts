"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { auth, signIn, signOut } from "@/auth";

console.log("--- AUTH ACTION TRIGGERED ---");

const JWT_SECRET = new TextEncoder().encode(

  process.env.JWT_SECRET || "fallback_secret_for_dev_only"
);

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  console.log("Attempting login for:", email, name);

  if (!email || !name) throw new Error("Email and name required");

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, name },
    });

    console.log("User upserted:", user.id);
    await setSession(user.id);
    redirect("/dashboard");
  } catch (err: any) {
    console.error("Login Error:", err);
    throw new Error(err.message || "Failed to authorize");
  }
}



async function setSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("travel_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("travel_session");
  
  // NextAuth signOut will handle its own redirect
  await signOut({ redirectTo: "/login" });
}


export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function getAuthUser() {
  // 1. Check NextAuth Session (Google)
  try {
    const session = await auth();
    if (session?.user?.email) {
      return await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    }
  } catch (err) {
    // Session might not be initialized
  }

  // 2. Check Custom JWT Session (Credentials)
  const cookieStore = await cookies();
  const token = cookieStore.get("travel_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (err) {
    return null;
  }
}

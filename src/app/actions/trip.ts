"use server";

import { revalidatePath } from "next/cache";

import { getAuthUser } from "./auth";
import { prisma } from "@/lib/prisma";

export async function updateTripStatusAction(
  tripId: string,
  status: string,
  notes?: string
) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  const result = await prisma.trip.updateMany({
    where: {
      id: tripId,
      users: {
        some: { id: user.id }
      }
    },
    data: {
      status,
      notes
    }
  });



  if (result.count === 0) {
    throw new Error("Trip not found or unauthorized");
  }

  revalidatePath(`/dashboard/trip/${tripId}`);
  revalidatePath("/dashboard");
}
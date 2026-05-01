"use server";

import { generateItineraryChain, parser, itinerarySchema } from "@/lib/langchain";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import TripSummaryEmail from "@/emails/TripSummaryEmail";
import { z } from "zod";
import { getAuthUser } from "./auth";
import { revalidatePath } from "next/cache";
import { addDays } from "date-fns";




const inputSchema = z.object({
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.string(),
  numberOfPeople: z.number().min(1).default(1),
  interests: z.array(z.string()),
  userId: z.string(),
  userEmail: z.string().email(),
  savePreferences: z.boolean().optional(),
});

export async function createDetailedItinerary(formData: z.infer<typeof inputSchema>) {
  const parsedData = inputSchema.parse(formData);
  
  const chain = generateItineraryChain();
  const formatInstructions = parser.getFormatInstructions();
  
  let aiResultString: string;
  try {
    aiResultString = await chain.invoke({
      destination: parsedData.destination,
      startDate: parsedData.startDate,
      endDate: parsedData.endDate,
      budget: parsedData.budget,
      numberOfPeople: parsedData.numberOfPeople.toString(),
      interests: parsedData.interests.join(", "),
      refinement: "",
      format_instructions: formatInstructions,
    });
  } catch (err: any) {
    if (err.message?.includes("429") || err.message?.includes("quota")) {
      throw new Error("AI quota limit reached. Please wait a few minutes and try again, or generate a new API key at aistudio.google.com/apikey");
    }
    throw new Error("AI generation failed: " + err.message);
  }

  const aiResult = (await parser.parse(aiResultString)) as z.infer<typeof itinerarySchema>;

  const startDateObj = new Date(parsedData.startDate);
  
  if (parsedData.savePreferences) {
    await prisma.user.update({
      where: { id: parsedData.userId },
      data: {
        preferredBudget: parsedData.budget,
        preferredInterests: parsedData.interests,
      }
    });
  }

  const trip = await prisma.trip.create({
    data: {
      title: aiResult.title,
      destination: parsedData.destination,
      budget: parsedData.budget,
      numberOfPeople: parsedData.numberOfPeople,
      startDate: startDateObj,
      endDate: new Date(parsedData.endDate),
      interests: parsedData.interests,
      packingList: aiResult.packingList,
      users: { connect: { id: parsedData.userId } },


      days: {
        create: aiResult.days.map((day) => ({
          date: addDays(startDateObj, day.dayIndex - 1),
          index: day.dayIndex,
          accommodation: day.accommodation,
          foodSuggestions: day.foodSuggestions,
          activities: {
            create: day.activities.map((act) => ({
              time: act.time,
              title: act.title,
              description: act.description,
              estimatedCost: act.estimatedCost,
              lat: act.lat,
              lng: act.lng,
              rating: act.rating,
              category: act.category,
            })),
          },
        })),
      },
    },
  });


  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Travel Planner <noreply@yourdomain.com>",
      to: [parsedData.userEmail],
      subject: `Your trip to ${parsedData.destination} is ready!`,
      react: TripSummaryEmail({ title: aiResult.title, destination: parsedData.destination }),
    });
  }

  return trip;
}

export async function regenerateTripAction(tripId: string, refinement: string) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  const oldTrip = await prisma.trip.findUnique({
    where: { id: tripId, users: { some: { id: user.id } } },
  });

  if (!oldTrip) throw new Error("Trip not found");

  const chain = generateItineraryChain();
  const formatInstructions = parser.getFormatInstructions();

  const aiResultString = await chain.invoke({
    destination: oldTrip.destination,
    startDate: oldTrip.startDate.toISOString(),
    endDate: oldTrip.endDate.toISOString(),
    budget: oldTrip.budget,
    interests: oldTrip.interests.join(", "),
    refinement: refinement,
    format_instructions: formatInstructions,
  });

  const aiResult = (await parser.parse(aiResultString)) as z.infer<typeof itinerarySchema>;

  // Create a NEW trip instead of updating
  const newTrip = await prisma.trip.create({
    data: {
      title: `${aiResult.title} (Refined)`,
      destination: oldTrip.destination,
      budget: oldTrip.budget,
      startDate: oldTrip.startDate,
      endDate: oldTrip.endDate,
      interests: oldTrip.interests,
      packingList: aiResult.packingList,
      users: { connect: { id: user.id } },
      days: {
        create: aiResult.days.map((day) => ({
          date: addDays(new Date(oldTrip.startDate), day.dayIndex - 1),
          index: day.dayIndex,
          accommodation: day.accommodation,
          foodSuggestions: day.foodSuggestions,
          activities: {
            create: day.activities.map((act) => ({
              time: act.time,
              title: act.title,
              description: act.description,
              estimatedCost: act.estimatedCost,
              lat: act.lat,
              lng: act.lng,
              rating: act.rating,
              category: act.category,
            })),
          },
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  return { success: true, newTripId: newTrip.id };
}



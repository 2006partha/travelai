"use server";

import { generateItineraryChain, parser, itinerarySchema } from "@/lib/langchain";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import TripSummaryEmail from "@/emails/TripSummaryEmail";
import { z } from "zod";
import { addDays } from "date-fns";


const inputSchema = z.object({
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.string(),
  interests: z.array(z.string()),
  userId: z.string(),
  userEmail: z.string().email(),
  savePreferences: z.boolean().optional(),
});

export async function createDetailedItinerary(formData: z.infer<typeof inputSchema>) {
  const parsedData = inputSchema.parse(formData);
  
  const chain = generateItineraryChain();
  const formatInstructions = parser.getFormatInstructions();
  
  // Note: we're invoking this directly here, but a real-time typing effect
  // would require switching this to an API route using streamText or Langchain's streaming responses.
  const aiResultString = await chain.invoke({
    destination: parsedData.destination,
    startDate: parsedData.startDate,
    endDate: parsedData.endDate,
    budget: parsedData.budget,
    interests: parsedData.interests.join(", "),
    format_instructions: formatInstructions,
  });

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
      startDate: startDateObj,
      endDate: new Date(parsedData.endDate),
      interests: parsedData.interests,
      users: { connect: { id: parsedData.userId } },
      days: {
        create: aiResult.days.map((day) => ({
          date: addDays(startDateObj, day.dayIndex - 1),
          index: day.dayIndex,
          activities: {
            create: day.activities.map((act) => ({
              time: act.time,
              title: act.title,
              description: act.description,
              estimatedCost: act.estimatedCost,
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

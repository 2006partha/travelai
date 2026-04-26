"use server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

const linksSchema = z.object({
  links: z.array(
    z.object({
      title: z.string().describe("Descriptive title, e.g. 'Skyscanner Flights to Paris' or 'Expedia Hotels'"),
      url: z.string().describe("The URL to search or book. Can be a parameterized search URL."),
      type: z.string().describe("Flight, Hotel, or Activity")
    })
  )
});

export async function getBookingLinksForTrip(destination: string, startDate: string, endDate: string) {
  const parser = StructuredOutputParser.fromZodSchema(linksSchema);
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY or GOOGLE_API_KEY environment variable");
    return [];
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey,
    temperature: 0.4,
  });

  const prompt = `You are a travel assistant. Generate 3 realistic booking search links (1 Flight, 1 Hotel, 1 Activity) for a trip to ${destination} from ${startDate} to ${endDate}.
  Generate valid search URLs for popular sites like Google Flights, Skyscanner, Booking.com, or TripAdvisor.
  For example, a Google Flights URL looks like https://www.google.com/travel/flights?q=flights+to+Paris.
  
  Format instructions:
  ${parser.getFormatInstructions()}`;

  try {
    const response = await model.invoke(prompt);
    const parsed = await parser.parse(response.content as string);
    return parsed.links;
  } catch(e) {
    console.error("Failed to generate booking links", e);
    return [];
  }
}

"use server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { getAuthUser } from "./auth";

const suggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      destination: z.string(),
      description: z.string(),
      estimatedBudget: z.string(),
      reasonToVisit: z.string()
    })
  )
});
// In-memory cache for suggestions (lasts 10 minutes)
let suggestionsCache: { data: any[]; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function getSuggestedTrips() {
  const user = await getAuthUser();
  if (!user) return [];

  // Return cached suggestions if fresh
  if (suggestionsCache && Date.now() - suggestionsCache.timestamp < CACHE_DURATION) {
    return suggestionsCache.data;
  }

  const parser = StructuredOutputParser.fromZodSchema(suggestionSchema);
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY or GOOGLE_API_KEY environment variable");
    return [];
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey,
    temperature: 0.8,
    maxRetries: 2,
  });

  const interests = user.preferredInterests && user.preferredInterests.length > 0 
    ? user.preferredInterests.join(", ") 
    : "general travel, sightseeing, popular tourist spots";
  const budget = user.preferredBudget || "moderate";

  const prompt = `You are an expert travel recommender. Suggest 3 amazing travel destinations specifically tailored to these preferences:
  User interests: ${interests}
  User budget: ${budget}
  
  Format instructions:
  ${parser.getFormatInstructions()}`;

  try {
    const response = await model.invoke(prompt);
    const parsed = await parser.parse(response.content as string);
    // Cache the result
    suggestionsCache = { data: parsed.suggestions, timestamp: Date.now() };
    return parsed.suggestions;
  } catch (e) {
    console.error("Failed to generate suggestions", e);
    // Return cached data even if expired, rather than nothing
    if (suggestionsCache) return suggestionsCache.data;
    return [];
  }
}

export async function getTrendingSeasonalTrip() {
  // Simulating trending trips for the current season
  return [
    {
      destination: "Kyoto, Japan",
      description: "Experience the magic of cherry blossom season with serene temples and traditional tea houses.",
      estimatedBudget: "Premium",
      whyNow: "Peak Sakura bloom offers the most breathtaking views of the year."
    },
    {
      destination: "Santorini, Greece",
      description: "Iconic blue-domed churches and world-famous sunsets over the Aegean Sea.",
      estimatedBudget: "Moderate",
      whyNow: "Perfect weather before the summer heat and peak tourist crowds."
    },
    {
      destination: "Banff, Canada",
      description: "Majestic turquoise lakes and snow-capped peaks in the heart of the Rockies.",
      estimatedBudget: "Luxury",
      whyNow: "Ideal for both late-season skiing and emerging spring hiking trails."
    }
  ];
}

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

export async function getSuggestedTrips() {
  const user = await getAuthUser();
  if (!user) return [];

  const parser = StructuredOutputParser.fromZodSchema(suggestionSchema);
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY or GOOGLE_API_KEY environment variable");
    return [];
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey,
    temperature: 0.8,
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
    return parsed.suggestions;
  } catch (e) {
    console.error("Failed to generate suggestions", e);
    return [];
  }
}

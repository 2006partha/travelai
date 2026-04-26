import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";

export const itinerarySchema = z.object({
  title: z.string().describe("Catchy title for the trip"),
  budgetSummary: z.string().describe("A brief summary of the expected budget"),
  days: z.array(
    z.object({
      dayIndex: z.number(),
      theme: z.string(),
      activities: z.array(
        z.object({
          time: z.string().describe("Time of the day e.g., 09:00 AM"),
          title: z.string().describe("Name of the activity"),
          description: z.string(),
          estimatedCost: z.number().describe("Estimated cost in USD"),
        })
      ),
    })
  ),
});

export const parser = StructuredOutputParser.fromZodSchema(itinerarySchema);

export function generateItineraryChain() {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    temperature: 0.7,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are an expert travel planner. Given the user's destination, budget, dates, and interests, create a detailed daily itinerary. \\n{format_instructions}"
    ),
    HumanMessagePromptTemplate.fromTemplate(
      "Destination: {destination}\\nDates: {startDate} to {endDate}\\nBudget: {budget}\\nInterests: {interests}"
    ),
  ]);

  return RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
  ]);
}

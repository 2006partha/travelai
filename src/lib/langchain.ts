import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";

export const itinerarySchema = z.object({
  title: z.string().describe("Catchy title for the trip"),
  budgetSummary: z.string().describe("A brief summary of the expected budget"),
  packingList: z.string().describe("A categorized packing list as a single markdown-formatted string"),
  days: z.array(
    z.object({
      dayIndex: z.number(),
      theme: z.string(),
      accommodation: z.string().describe("Specific hotel, hostel, or stay recommendation for this day"),
      foodSuggestions: z.string().describe("Top local food spots and restaurants for this day"),
      activities: z.array(
        z.object({
          time: z.string().describe("Time e.g., 09:00 AM"),
          title: z.string().describe("Name of activity"),
          description: z.string(),
          estimatedCost: z.number().describe("Cost in USD"),
          lat: z.number().describe("Latitude of the location"),
          lng: z.number().describe("Longitude of the location"),
          rating: z.number().describe("Average rating out of 5"),
          category: z.string().describe("Category e.g., Adventure, Culture, Relax"),
        })
      ),
    })
  ),
});

export const parser = StructuredOutputParser.fromZodSchema(itinerarySchema);

export function generateItineraryChain() {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    temperature: 0.7,
  });


  const prompt = ChatPromptTemplate.fromMessages([
    HumanMessagePromptTemplate.fromTemplate(
      "ROLE: You are a luxury travel architect. Create a high-fidelity daily itinerary for {numberOfPeople} travelers. " +
      "For each day, provide a specific accommodation (hotel/hostel) and local food spots that suit this group size and budget. " +
      "Each activity MUST have precise Latitude and Longitude coordinates for map plotting. " +
      "Prioritize user interests, budget constraints, and group dynamics. \n\n" +
      "TRIP DETAILS: \n" +
      "Destination: {destination} \n" +
      "Dates: {startDate} to {endDate} \n" +
      "Budget: {budget} \n" +
      "Interests: {interests} \n" +
      "Number of People: {numberOfPeople} \n" +
      "Refinement Request: {refinement} \n\n" +
      "OUTPUT FORMAT: \n{format_instructions}"
    ),
  ]);


  return RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
  ]);
}



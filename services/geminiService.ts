
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateHolidayGreeting = async (): Promise<string> => {
  if (!API_KEY) {
    console.warn("API Key missing, returning default greeting.");
    return "May the emerald glow of this season bring prosperity and golden light to your path.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Write a high-end, poetic, luxury-themed holiday greeting for an interactive Christmas tree experience. Use themes of emerald green, metallic gold, starlight, and signature elegance. Keep it under 25 words.",
      config: {
        temperature: 1.0,
        topP: 0.95,
        maxOutputTokens: 100,
      }
    });

    return response.text.replace(/"/g, '').trim() || "Elegance is the signature of this golden season.";
  } catch (error) {
    console.error("Error generating AI greeting:", error);
    return "Wishing you a season as brilliant as the stars and as deep as the emerald forest.";
  }
};

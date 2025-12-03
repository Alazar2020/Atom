import { GoogleGenAI, Type } from "@google/genai";
import { ElementInfo } from "../types";

// Initialize Gemini client
// API Key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchElementData = async (elementName: string): Promise<ElementInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide detailed scientific and environmental information about the chemical element: ${elementName}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            symbol: { type: Type.STRING },
            atomicNumber: { type: Type.INTEGER },
            atomicMass: { type: Type.NUMBER },
            category: { type: Type.STRING },
            description: { type: Type.STRING, description: "A brief scientific description of the atom." },
            environmentInfo: { type: Type.STRING, description: "Where is this element found in nature or the environment? How does it interact with the environment?" },
            commonUses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            funFact: { type: Type.STRING }
          },
          required: ["name", "symbol", "atomicNumber", "atomicMass", "category", "description", "environmentInfo", "commonUses", "funFact"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from Gemini");
    }
    return JSON.parse(text) as ElementInfo;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback or re-throw depending on app needs. For now we re-throw to handle in UI.
    throw error;
  }
};
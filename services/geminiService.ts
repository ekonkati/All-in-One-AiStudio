
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Corrected import path from ../types/index to ../types/index.ts to be explicit
import { ProjectDetails } from "../types/index";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the structural engineering AI
const SYSTEM_INSTRUCTION = `
You are StructurAI, a world-class structural engineering assistant. 
Your goal is to help users design, analyze, and estimate construction projects.
You are technical, precise, yet accessible. 
When users describe a project (e.g., "G+2 house in Hyderabad"), extract technical parameters.
Always convert units to standard engineering formats (Metric or Imperial based on context, default to feet/meters).
`;

export const extractProjectFromChat = async (history: string): Promise<Partial<ProjectDetails>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract project details from this conversation history into a JSON object. 
      History: ${history}
      
      If information is missing, make reasonable engineering assumptions for a concept design.
      For 'dimensions', assume a standard plot size if not specified (e.g., 40x60 ft).
      For 'type', infer from context (House = RCC, Warehouse = PEB).
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['RCC', 'Steel', 'PEB', 'Composite', 'Retaining Wall', 'Water Tank', 'Landfill', 'Other'] },
            location: { type: Type.STRING },
            stories: { type: Type.NUMBER },
            soilType: { type: Type.STRING },
            dimensions: {
              type: Type.OBJECT,
              properties: {
                length: { type: Type.NUMBER },
                width: { type: Type.NUMBER }
              }
            },
            budget: { type: Type.NUMBER }
          }
        }
      }
    });

    if (response.text) {
      let cleanedText = response.text.trim();
      // Remove markdown formatting if present
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleanedText.startsWith("```")) {
         cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      return JSON.parse(cleanedText);
    }
    return {};
  } catch (error) {
    console.error("Gemini extraction error:", error);
    return {};
  }
};

export const streamChatResponse = async function* (
  message: string, 
  currentProject: Partial<ProjectDetails> | null
) {
  const context = currentProject 
    ? `Current Project Context: ${JSON.stringify(currentProject)}`
    : "No project started yet.";

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: `User Message: ${message}\n\n${context}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    for await (const chunk of stream) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Gemini stream error:", error);
    yield "I encountered a connection error. Please try again.";
  }
};
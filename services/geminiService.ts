import { GoogleGenAI } from "@google/genai";
import { DefineCanvas } from "../types";

// Helper to safely get the API key
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("API Key is missing. AI features will be disabled.");
    return "";
  }
  return key;
};

export const generateIdeasWithGemini = async (defineData: DefineCanvas): Promise<string[]> => {
  const apiKey = getApiKey();
  if (!apiKey) return ["Error: No API Key configured."];

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Actúa como un profesor experto en Design Thinking y emprendimiento escolar.
    Ayuda a un estudiante a generar 5 ideas de solución creativas y viables para su proyecto.
    
    Contexto del problema (Fase Definir):
    - Usuario: ${defineData.user}
    - Necesidad: ${defineData.need}
    - Insight (Por qué): ${defineData.insight}
    
    Genera 5 ideas cortas, innovadoras y realizables por un estudiante de secundaria.
    Devuélvelas en formato JSON como una lista de strings.
    Ejemplo: ["Crear una app que...", "Organizar una feria...", "Diseñar un producto..."]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) return [];

    const ideas = JSON.parse(text);
    if (Array.isArray(ideas)) {
      return ideas;
    }
    return [];
  } catch (error) {
    console.error("Error generating ideas:", error);
    return ["Hubo un error al conectar con el asistente virtual."];
  }
};
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing, using fallback questions.");
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Generate 3 multiple-choice questions about Pulmonary Embolism (PE) prevention, symptoms, and pathology.
    The target audience includes both ordinary people and medical students.
    The language must be Simplified Chinese.
    Focus on accuracy and educational value.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    throw new Error("No content generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

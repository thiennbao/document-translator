/* global clearInterval, console, CustomFunctions, setInterval */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDzkhf7XJvXaCxFYE6crrbIxAr4Ntizwv4");

export const promptGemini = async (prompt: string, model: string) => {
  const genModel = genAI.getGenerativeModel({ model });
  const result = await genModel.generateContent(prompt);
  return result.response.text();
};

/**
 * Summarize.
 * @customfunction SUMMARIZE
 * @param cell The cell text
 * @returns The summarization text
 */
export function summarize(cell: string) {
  try {
    const prompt = `Summarize the following text: "${cell}".`;
    return promptGemini(prompt, "gemini-2.0-flash");
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

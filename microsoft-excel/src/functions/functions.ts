/* global clearInterval, console, CustomFunctions, setInterval */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDzkhfyourAPIkey4Ntizwv4");

export const promptGemini = async (prompt: string, model: string, temperature: number) => {
  const genModel = genAI.getGenerativeModel({ model, generationConfig: { temperature } });
  const result = await genModel.generateContent(prompt);
  return result.response.text();
};

/**
 * Summarize.
 * @customfunction SUMMARIZE
 * @param text The cell text
 * @param format The format that user would like to output (a prompt)
 * @param temperature: The temperature to be set
 * @param model:The model that user would like to use
 * @returns The summarization text
 */
export function summarize(text: string, format?: string, temperature?: number, model?: string) {
  try {
    const prompt =
      `Summarize the following text: "${text}".` +
      (format && `Return the output with the following format: "${format}"`);
    return promptGemini(prompt, model || "gemini-2.0-flash", temperature || 1);
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

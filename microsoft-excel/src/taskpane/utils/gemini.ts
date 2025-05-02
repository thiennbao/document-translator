import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDzkhfyourAPIkey4Ntizwv4");

export const promptGemini = async (prompt: string, model: string) => {
  const genModel = genAI.getGenerativeModel({ model });
  const result = await genModel.generateContent(prompt);
  return result.response.text();
};

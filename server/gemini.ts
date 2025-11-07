// Referenced from javascript_gemini blueprint
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
  console.warn("⚠️  GEMINI_API_KEY is not set. Chatbot features will be unavailable.");
}

function summarizeChequesForPrompt(cheques: any[]): string {
  if (cheques.length === 0) {
    return "No cheques available in the system.";
  }

  const summary = cheques.map((c, idx) => {
    return `${idx + 1}. Cheque #${c.chequeNumber} - Payee: ${c.toPayee}, Amount: $${c.amount}, Issue Date: ${c.issuedDate}, Due Date: ${c.dueDate}, Status: ${c.status}`;
  }).join('\n');

  return `Total cheques: ${cheques.length}\n\nCheque details:\n${summary}`;
}

export async function queryCheques(userQuery: string, chequesData: any[]): Promise<string> {
  if (!ai) {
    throw new Error("Chatbot is not available. GEMINI_API_KEY is not configured.");
  }

  try {
    const systemInstruction = `You are an intelligent assistant for a cheque management system. 
Help users query and analyze their cheques using natural language.

Guidelines:
- Be concise, friendly, and professional
- Format dates clearly (e.g., "November 21st, 2025" or "21 Nov 2025")
- Format currency with commas and 2 decimal places (e.g., "$1,234.56")
- When listing cheques, use bullet points or numbered lists
- Parse natural language dates (e.g., "by 21st November", "before December", "this month")
- Provide summaries and totals when relevant
- If no cheques match, suggest alternatives politely`;

    const chequesSummary = summarizeChequesForPrompt(chequesData);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction,
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Here is the current cheque data:\n\n${chequesSummary}\n\nUser question: ${userQuery}`,
            },
          ],
        },
      ],
    });

    const textResponse = response.response?.text();
    return textResponse || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to query cheques: ${error}`);
  }
}

export function isChatbotAvailable(): boolean {
  return ai !== null;
}

import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import type { GeneratedContent } from "./types";

const InputSchema = z.object({ notes: z.string().min(1).max(20000) });

const SYSTEM_PROMPT = `You are FlashGenius, an AI that turns study notes into flashcards and quizzes.

Given the user's notes, output STRICT JSON matching this exact shape (no markdown, no code fences, no commentary):

{
  "flashcards": [
    { "id": "fc1", "question": "...", "answer": "..." }
    // exactly 10 items, ids fc1..fc10
  ],
  "quiz": [
    {
      "id": "q1",
      "difficulty": "easy" | "medium" | "hard",
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "A" | "B" | "C" | "D"
    }
    // exactly 5 items: 2 easy, 2 medium, 1 hard. ids q1..q5.
  ],
  "error": null
}

Rules:
- Return ONLY valid JSON, nothing else.
- Questions must be answerable strictly from the provided notes.
- Keep answers concise (1-3 sentences).
- All four MCQ options must be plausible; exactly one is correct.
- If notes are too short or unusable, return { "flashcards": [], "quiz": [], "error": "reason" }.`;

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text.trim();
}

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<GeneratedContent> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { flashcards: [], quiz: [], error: "AI is not configured." };

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-2.5-flash");

    try {
      const { text } = await generateText({
        model,
        system: SYSTEM_PROMPT,
        prompt: `Notes:\n\n${data.notes}`,
      });

      const parsed = JSON.parse(extractJson(text)) as GeneratedContent;
      if (!Array.isArray(parsed.flashcards) || !Array.isArray(parsed.quiz)) {
        return { flashcards: [], quiz: [], error: "AI returned an unexpected format." };
      }
      return { flashcards: parsed.flashcards, quiz: parsed.quiz, error: parsed.error ?? null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed.";
      if (message.includes("429")) return { flashcards: [], quiz: [], error: "Rate limit reached. Please try again shortly." };
      if (message.includes("402")) return { flashcards: [], quiz: [], error: "AI credits exhausted. Add credits to continue." };
      return { flashcards: [], quiz: [], error: message };
    }
  });

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateResponse(
  prompt: string,
  temperature?: number,
  topP?: number,
  frequencyPenalty?: number,
  presencePenalty?: number,
  maxTokens?: number,
  seed?: number
): Promise<string> {
  const params: any = {
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens || 500,
  };

  if (temperature !== undefined) params.temperature = temperature;
  if (topP !== undefined) params.top_p = topP;
  if (frequencyPenalty !== undefined)
    params.frequency_penalty = frequencyPenalty;
  if (presencePenalty !== undefined) params.presence_penalty = presencePenalty;
  if (seed !== undefined) params.seed = seed;

  const completion = await openai.chat.completions.create(params);

  return completion.choices[0]?.message?.content || "";
}

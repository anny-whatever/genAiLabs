import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3, // Built-in retries
  timeout: 60000, // 60s timeout
});

// Exponential backoff retry wrapper
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on 4xx errors (except 429)
      if (
        error?.status &&
        error.status >= 400 &&
        error.status < 500 &&
        error.status !== 429
      ) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.warn(
          `Retry attempt ${attempt + 1} after ${delay}ms`,
          error?.message
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

export interface GenerateResponseResult {
  content: string;
  finishReason: string;
  tokenLogprobs?: Array<{
    token: string;
    logprob: number;
    probability: number;
    topLogprobs?: Array<{
      token: string;
      logprob: number;
      probability: number;
    }>;
  }>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function generateResponse(
  prompt: string,
  temperature?: number,
  topP?: number,
  frequencyPenalty?: number,
  presencePenalty?: number,
  maxTokens?: number,
  seed?: number,
  logprobs?: boolean,
  topLogprobs?: number
): Promise<GenerateResponseResult> {
  const params: any = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens || 500,
  };

  if (temperature !== undefined) params.temperature = temperature;
  if (topP !== undefined) params.top_p = topP;
  if (frequencyPenalty !== undefined)
    params.frequency_penalty = frequencyPenalty;
  if (presencePenalty !== undefined) params.presence_penalty = presencePenalty;
  if (seed !== undefined) params.seed = seed;
  if (logprobs) {
    params.logprobs = true;
    params.top_logprobs = topLogprobs || 5;
  }

  const completion = await withRetry(() =>
    openai.chat.completions.create(params)
  );

  const choice = completion.choices[0];
  const content = choice?.message?.content || "";
  const finishReason = choice?.finish_reason || "unknown";

  // Extract logprobs if available
  let tokenLogprobs: GenerateResponseResult["tokenLogprobs"] = undefined;
  if (logprobs && choice?.logprobs?.content) {
    tokenLogprobs = choice.logprobs.content.map((lp: any) => ({
      token: lp.token,
      logprob: lp.logprob,
      probability: Math.exp(lp.logprob),
      topLogprobs: lp.top_logprobs?.map((tlp: any) => ({
        token: tlp.token,
        logprob: tlp.logprob,
        probability: Math.exp(tlp.logprob),
      })),
    }));
  }

  return {
    content,
    finishReason,
    tokenLogprobs,
    usage: completion.usage
      ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens,
        }
      : undefined,
  };
}

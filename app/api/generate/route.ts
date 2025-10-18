import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "@/lib/openai";
import { calculateMetrics } from "@/lib/metrics";
import { GenerateRequest, ExperimentResult } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // Verify password
    const password = request.headers.get("x-app-password");
    const appPassword = process.env.APP_PASSWORD;

    if (!password || password !== appPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: GenerateRequest = await request.json();
    const {
      prompt,
      temperatureRange,
      topPRange,
      frequencyPenaltyRange,
      presencePenaltyRange,
      seed,
      maxTokens,
      numResponses,
      enableTemperature,
      enableTopP,
      enableFrequencyPenalty,
      enablePresencePenalty,
      enableSeed,
    } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate parameter combinations
    const tempStep =
      numResponses > 1 && enableTemperature
        ? (temperatureRange[1] - temperatureRange[0]) / (numResponses - 1)
        : 0;
    const topPStep =
      numResponses > 1 && enableTopP
        ? (topPRange[1] - topPRange[0]) / (numResponses - 1)
        : 0;
    const freqPenaltyStep =
      numResponses > 1 && enableFrequencyPenalty
        ? (frequencyPenaltyRange[1] - frequencyPenaltyRange[0]) /
          (numResponses - 1)
        : 0;
    const presPenaltyStep =
      numResponses > 1 && enablePresencePenalty
        ? (presencePenaltyRange[1] - presencePenaltyRange[0]) /
          (numResponses - 1)
        : 0;

    const results: ExperimentResult[] = [];

    // Generate responses for each parameter combination
    for (let i = 0; i < numResponses; i++) {
      const temperature = enableTemperature
        ? numResponses > 1
          ? temperatureRange[0] + tempStep * i
          : temperatureRange[0]
        : undefined;
      const top_p = enableTopP
        ? numResponses > 1
          ? topPRange[0] + topPStep * i
          : topPRange[0]
        : undefined;
      const frequency_penalty = enableFrequencyPenalty
        ? numResponses > 1
          ? frequencyPenaltyRange[0] + freqPenaltyStep * i
          : frequencyPenaltyRange[0]
        : undefined;
      const presence_penalty = enablePresencePenalty
        ? numResponses > 1
          ? presencePenaltyRange[0] + presPenaltyStep * i
          : presencePenaltyRange[0]
        : undefined;
      const useSeed = enableSeed ? seed : undefined;

      try {
        const startTime = Date.now();
        const result = await generateResponse(
          prompt,
          temperature,
          top_p,
          frequency_penalty,
          presence_penalty,
          maxTokens,
          useSeed,
          true, // enable logprobs
          5 // top 5 logprobs
        );
        const responseTime = Date.now() - startTime;

        const metrics = calculateMetrics(
          prompt,
          result.content,
          result.tokenLogprobs
        );

        const params: any = {};
        if (temperature !== undefined) params.temperature = temperature;
        if (top_p !== undefined) params.top_p = top_p;
        if (frequency_penalty !== undefined)
          params.frequency_penalty = frequency_penalty;
        if (presence_penalty !== undefined)
          params.presence_penalty = presence_penalty;
        if (useSeed !== undefined) params.seed = useSeed;
        params.max_tokens = maxTokens;

        results.push({
          id: `${Date.now()}-${i}`,
          prompt,
          params,
          response: result.content,
          metrics,
          timestamp: Date.now(),
          tokenLogprobs: result.tokenLogprobs,
          finishReason: result.finishReason,
          responseTime,
        });
      } catch (error) {
        console.error(`Error generating response ${i}:`, error);
        // Continue with other responses even if one fails
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate any responses" },
        { status: 500 }
      );
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

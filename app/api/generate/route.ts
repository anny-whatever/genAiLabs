import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/openai';
import { calculateMetrics } from '@/lib/metrics';
import { GenerateRequest, ExperimentResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, temperatureRange, topPRange, numResponses } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate parameter combinations
    const tempStep = numResponses > 1 
      ? (temperatureRange[1] - temperatureRange[0]) / (numResponses - 1) 
      : 0;
    const topPStep = numResponses > 1
      ? (topPRange[1] - topPRange[0]) / (numResponses - 1)
      : 0;

    const results: ExperimentResult[] = [];

    // Generate responses for each parameter combination
    for (let i = 0; i < numResponses; i++) {
      const temperature = numResponses > 1
        ? temperatureRange[0] + (tempStep * i)
        : temperatureRange[0];
      const top_p = numResponses > 1
        ? topPRange[0] + (topPStep * i)
        : topPRange[0];

      try {
        const response = await generateResponse(prompt, temperature, top_p);
        const metrics = calculateMetrics(prompt, response);

        results.push({
          id: `${Date.now()}-${i}`,
          prompt,
          params: { temperature, top_p },
          response,
          metrics,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error(`Error generating response ${i}:`, error);
        // Continue with other responses even if one fails
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any responses' },
        { status: 500 }
      );
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


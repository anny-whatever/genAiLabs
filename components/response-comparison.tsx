"use client";

import { ExperimentResult } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ResponseComparisonProps {
  results: ExperimentResult[];
}

export function ResponseComparison({ results }: ResponseComparisonProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <Card key={result.id}>
          <CardHeader>
            <CardTitle>Response #{index + 1}</CardTitle>
            <CardDescription>
              {result.params.temperature &&
                `Temperature: ${result.params.temperature.toFixed(2)}`}
              {result.params.top_p &&
                ` | Top P: ${result.params.top_p.toFixed(2)}`}
              {result.params.frequency_penalty &&
                ` | Freq Penalty: ${result.params.frequency_penalty.toFixed(
                  2
                )}`}
              {result.params.presence_penalty &&
                ` | Pres Penalty: ${result.params.presence_penalty.toFixed(2)}`}
              {result.params.seed && ` | Seed: ${result.params.seed}`}
              {result.params.max_tokens &&
                ` | Max Tokens: ${result.params.max_tokens}`}
              {result.responseTime && ` | Time: ${result.responseTime}ms`}
              {result.finishReason && ` | Finish: ${result.finishReason}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <p className="text-sm whitespace-pre-wrap">{result.response}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Coherence</p>
                  <p className="text-lg font-semibold">
                    {result.metrics.coherence.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Length Score</p>
                  <p className="text-lg font-semibold">
                    {result.metrics.lengthScore.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completeness</p>
                  <p className="text-lg font-semibold">
                    {result.metrics.completeness.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="text-lg font-semibold">
                    {result.metrics.confidence?.toFixed(3) ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entropy</p>
                  <p className="text-lg font-semibold">
                    {result.metrics.entropy?.toFixed(2) ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Perplexity</p>
                  <p className="text-lg font-semibold">
                    {result.metrics.perplexity?.toFixed(2) ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Repetition</p>
                  <p className="text-lg font-semibold">
                    {result.metrics.repetitionRatio?.toFixed(3) ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vocab Rich</p>
                  <p className="text-lg font-semibold">
                    {result.metrics.vocabularyRichness?.toFixed(3) ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

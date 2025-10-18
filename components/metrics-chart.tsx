"use client";

import { ExperimentResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MetricsChartProps {
  results: ExperimentResult[];
}

export function MetricsChart({ results }: MetricsChartProps) {
  if (results.length === 0) {
    return null;
  }

  const chartData = results.map((result, index) => ({
    name: `#${index + 1}`,
    params: `T:${result.params.temperature?.toFixed(2) ?? "N/A"} P:${
      result.params.top_p?.toFixed(2) ?? "N/A"
    }`,
    Coherence: result.metrics.coherence,
    "Length Score": result.metrics.lengthScore,
    Completeness: result.metrics.completeness,
    Confidence: result.metrics.confidence ?? 0,
    "Vocab Richness": result.metrics.vocabularyRichness ?? 0,
    // For display purposes, invert these so higher is better in chart
    "Low Entropy": result.metrics.entropy
      ? Math.max(0, 5 - result.metrics.entropy) / 5
      : 0,
    "Low Perplexity": result.metrics.perplexity
      ? Math.max(0, Math.min(1, 20 / result.metrics.perplexity))
      : 0,
    "Low Repetition": result.metrics.repetitionRatio
      ? 1 - result.metrics.repetitionRatio
      : 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metrics Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border border-border p-3 rounded shadow-lg">
                      <p className="font-semibold mb-1">
                        {payload[0].payload.params}
                      </p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                          {entry.name}: {(entry.value as number).toFixed(3)}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="Coherence" fill="#8884d8" />
            <Bar dataKey="Length Score" fill="#82ca9d" />
            <Bar dataKey="Completeness" fill="#ffc658" />
            <Bar dataKey="Confidence" fill="#ff8042" />
            <Bar dataKey="Vocab Richness" fill="#a28dd8" />
            <Bar dataKey="Low Entropy" fill="#6dd88d" />
            <Bar dataKey="Low Repetition" fill="#d88682" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

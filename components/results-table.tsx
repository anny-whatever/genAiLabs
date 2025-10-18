"use client";

import { ExperimentResult } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMetricDescription } from "@/lib/metrics";
import { InfoIcon } from "lucide-react";

interface ResultsTableProps {
  results: ExperimentResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return null;
  }

  // Find best values for highlighting
  const bestCoherence = Math.max(...results.map((r) => r.metrics.coherence));
  const bestLength = Math.max(...results.map((r) => r.metrics.lengthScore));
  const bestCompleteness = Math.max(
    ...results.map((r) => r.metrics.completeness)
  );

  const isBest = (value: number, best: number) =>
    Math.abs(value - best) < 0.001;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Temperature</TableHead>
                <TableHead>Top P</TableHead>
                <TableHead>Freq Penalty</TableHead>
                <TableHead>Pres Penalty</TableHead>
                <TableHead>Seed</TableHead>
                <TableHead>Max Tokens</TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        Coherence
                        <InfoIcon className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {getMetricDescription("coherence")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        Length
                        <InfoIcon className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {getMetricDescription("lengthScore")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        Completeness
                        <InfoIcon className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {getMetricDescription("completeness")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>Response Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    {result.params.temperature?.toFixed(2) ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    {result.params.top_p?.toFixed(2) ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    {result.params.frequency_penalty?.toFixed(2) ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    {result.params.presence_penalty?.toFixed(2) ?? "N/A"}
                  </TableCell>
                  <TableCell>{result.params.seed ?? "N/A"}</TableCell>
                  <TableCell>{result.params.max_tokens ?? "N/A"}</TableCell>
                  <TableCell
                    className={
                      isBest(result.metrics.coherence, bestCoherence)
                        ? "font-bold text-green-600"
                        : ""
                    }
                  >
                    {result.metrics.coherence.toFixed(3)}
                  </TableCell>
                  <TableCell
                    className={
                      isBest(result.metrics.lengthScore, bestLength)
                        ? "font-bold text-green-600"
                        : ""
                    }
                  >
                    {result.metrics.lengthScore.toFixed(3)}
                  </TableCell>
                  <TableCell
                    className={
                      isBest(result.metrics.completeness, bestCompleteness)
                        ? "font-bold text-green-600"
                        : ""
                    }
                  >
                    {result.metrics.completeness.toFixed(3)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {result.response.slice(0, 100)}...
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

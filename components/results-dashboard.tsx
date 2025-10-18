"use client";

import { ExperimentResult } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultsTable } from "./results-table";
import { MetricsChart } from "./metrics-chart";
import { ResponseComparison } from "./response-comparison";
import { motion } from "framer-motion";

interface ResultsDashboardProps {
  results: ExperimentResult[];
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics Chart</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ResultsTable results={results} />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <MetricsChart results={results} />
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <ResponseComparison results={results} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { ExperimentResult } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResultsDashboard } from "./results-dashboard";
import { BarChart3 } from "lucide-react";

interface ResultsModalProps {
  results: ExperimentResult[];
}

export function ResultsModal({ results }: ResultsModalProps) {
  const [open, setOpen] = useState(false);

  if (results.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          View Results ({results.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Experiment Results
          </DialogTitle>
          <DialogDescription>
            Analyze and compare your LLM responses with different parameter
            configurations. View metrics, charts, and detailed comparisons.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <ResultsDashboard results={results} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

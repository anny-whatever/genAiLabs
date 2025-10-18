"use client";

import { ExperimentResult } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Save } from "lucide-react";
import { exportAsJSON, exportAsCSV, downloadFile } from "@/lib/export";
import { saveRunToLocalStorage } from "@/lib/storage";
import { useState } from "react";

interface ExportActionsProps {
  results: ExperimentResult[];
  onSaveSuccess?: () => void;
}

export function ExportActions({ results, onSaveSuccess }: ExportActionsProps) {
  const [runName, setRunName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleExportJSON = () => {
    const json = exportAsJSON(results);
    const timestamp = new Date().toISOString().split("T")[0];
    downloadFile(
      json,
      `ai-quality-results-${timestamp}.json`,
      "application/json"
    );
  };

  const handleExportCSV = () => {
    const csv = exportAsCSV(results);
    const timestamp = new Date().toISOString().split("T")[0];
    downloadFile(csv, `ai-quality-results-${timestamp}.csv`, "text/csv");
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      const run = saveRunToLocalStorage(results, runName.trim() || undefined);
      alert(`Run saved successfully as "${run.name}"!`);
      setRunName("");
      onSaveSuccess?.();
    } catch (error) {
      alert("Failed to save run. Please try again.");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export & Save</CardTitle>
        <CardDescription>
          Save your results as a run or export them for further analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Save Run Section */}
          <div className="space-y-2">
            <Label htmlFor="run-name">Run Name (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="run-name"
                placeholder="e.g., Creative Writing Test"
                value={runName}
                onChange={(e) => setRunName(e.target.value)}
                disabled={results.length === 0}
              />
              <Button
                onClick={handleSave}
                disabled={results.length === 0 || isSaving}
                variant="default"
                className="whitespace-nowrap"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Run"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Saves this experiment as a separate run in your browser
            </p>
          </div>

          {/* Export Section */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              onClick={handleExportJSON}
              disabled={results.length === 0}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>

            <Button
              onClick={handleExportCSV}
              disabled={results.length === 0}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

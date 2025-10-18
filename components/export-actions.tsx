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
import { Download, Save } from "lucide-react";
import { exportAsJSON, exportAsCSV, downloadFile } from "@/lib/export";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/storage";

interface ExportActionsProps {
  results: ExperimentResult[];
  onLoad?: (results: ExperimentResult[]) => void;
}

export function ExportActions({ results, onLoad }: ExportActionsProps) {
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
    saveToLocalStorage(results);
    alert("Results saved to local storage!");
  };

  const handleLoad = () => {
    const loaded = loadFromLocalStorage();
    if (loaded.length > 0) {
      onLoad?.(loaded);
      alert(`Loaded ${loaded.length} result(s) from local storage!`);
    } else {
      alert("No saved results found in local storage.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export & Save</CardTitle>
        <CardDescription>
          Save your results locally or export them for further analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
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

          <Button
            onClick={handleSave}
            disabled={results.length === 0}
            variant="outline"
          >
            <Save className="mr-2 h-4 w-4" />
            Save to Browser
          </Button>

          <Button onClick={handleLoad} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Load from Browser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

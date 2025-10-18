"use client";

import { useState, useEffect } from "react";
import { ExperimentRun } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Trash2, Upload, Download } from "lucide-react";
import {
  loadAllRunsFromLocalStorage,
  deleteRunFromLocalStorage,
  clearLocalStorage,
} from "@/lib/storage";
import { exportAsJSON, downloadFile } from "@/lib/export";

interface SavedRunsModalProps {
  onLoadRun: (run: ExperimentRun) => void;
}

export function SavedRunsModal({ onLoadRun }: SavedRunsModalProps) {
  const [open, setOpen] = useState(false);
  const [runs, setRuns] = useState<ExperimentRun[]>([]);
  const [deleteRunId, setDeleteRunId] = useState<string | null>(null);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);

  // Load runs when modal opens
  useEffect(() => {
    if (open) {
      loadRuns();
    }
  }, [open]);

  const loadRuns = () => {
    const savedRuns = loadAllRunsFromLocalStorage();
    // Sort by timestamp descending (newest first)
    setRuns(savedRuns.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleLoadRun = (run: ExperimentRun) => {
    onLoadRun(run);
    setOpen(false);
  };

  const handleDeleteRun = (runId: string) => {
    deleteRunFromLocalStorage(runId);
    loadRuns();
    setDeleteRunId(null);
  };

  const handleClearAll = () => {
    clearLocalStorage();
    loadRuns();
    setShowClearAllDialog(false);
  };

  const handleExportRun = (run: ExperimentRun) => {
    const json = exportAsJSON(run.results);
    const timestamp = new Date(run.timestamp).toISOString().split("T")[0];
    downloadFile(
      json,
      `${run.name.replace(/[^a-z0-9]/gi, "_")}-${timestamp}.json`,
      "application/json"
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <History className="h-5 w-5" />
            Saved Runs ({runs.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Saved Experiment Runs
            </DialogTitle>
            <DialogDescription>
              View, load, or delete your previously saved experiment runs. Each
              run is saved separately with its own timestamp.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end mb-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowClearAllDialog(true)}
              disabled={runs.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          {runs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No saved runs found.</p>
              <p className="text-sm mt-2">
                Run an experiment and save it to see it here.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {runs.map((run) => (
                  <Card key={run.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{run.name}</CardTitle>
                          <CardDescription>
                            {new Date(run.timestamp).toLocaleString()} •{" "}
                            {run.results.length} result
                            {run.results.length !== 1 ? "s" : ""}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExportRun(run)}
                            title="Export run as JSON"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteRunId(run.id)}
                            title="Delete run"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          <span className="font-medium">Prompt:</span>{" "}
                          {run.results[0]?.prompt || "N/A"}
                        </p>
                        <Button
                          onClick={() => handleLoadRun(run)}
                          className="w-full"
                          variant="outline"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Load This Run
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deleteRunId !== null}
        onOpenChange={(open) => !open && setDeleteRunId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Run?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this run? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteRunId && handleDeleteRun(deleteRunId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear all confirmation dialog */}
      <AlertDialog
        open={showClearAllDialog}
        onOpenChange={setShowClearAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Runs?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all saved runs? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

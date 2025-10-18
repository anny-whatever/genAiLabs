import { ExperimentResult, ExperimentRun } from "@/types";

const STORAGE_KEY = "ai-quality-analyzer-runs";

/**
 * Save a new experiment run to localStorage
 */
export function saveRunToLocalStorage(
  results: ExperimentResult[],
  runName?: string
): ExperimentRun {
  if (typeof window === "undefined")
    throw new Error("Cannot access localStorage");

  try {
    const runs = loadAllRunsFromLocalStorage();

    // Generate run name if not provided
    const timestamp = Date.now();
    const defaultName = `Run ${new Date(timestamp).toLocaleString()}`;
    const run: ExperimentRun = {
      id: `run-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
      name: runName || defaultName,
      timestamp,
      results,
    };

    runs.push(run);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));

    return run;
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    throw error;
  }
}

/**
 * Load all experiment runs from localStorage
 */
export function loadAllRunsFromLocalStorage(): ExperimentRun[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    return JSON.parse(stored) as ExperimentRun[];
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return [];
  }
}

/**
 * Load a specific run by ID
 */
export function loadRunFromLocalStorage(runId: string): ExperimentRun | null {
  const runs = loadAllRunsFromLocalStorage();
  return runs.find((run) => run.id === runId) || null;
}

/**
 * Delete a specific run by ID
 */
export function deleteRunFromLocalStorage(runId: string): void {
  if (typeof window === "undefined") return;

  try {
    const runs = loadAllRunsFromLocalStorage();
    const filteredRuns = runs.filter((run) => run.id !== runId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRuns));
  } catch (error) {
    console.error("Failed to delete from localStorage:", error);
    throw error;
  }
}

/**
 * Clear all stored runs
 */
export function clearLocalStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}

// Legacy functions for backward compatibility
/**
 * @deprecated Use loadAllRunsFromLocalStorage instead
 */
export function loadFromLocalStorage(): ExperimentResult[] {
  const runs = loadAllRunsFromLocalStorage();
  if (runs.length === 0) return [];
  // Return results from the most recent run
  return runs[runs.length - 1].results;
}

/**
 * @deprecated Use saveRunToLocalStorage instead
 */
export function saveToLocalStorage(results: ExperimentResult[]): void {
  saveRunToLocalStorage(results);
}

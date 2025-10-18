import { ExperimentResult } from "@/types";

const STORAGE_KEY = "ai-quality-analyzer-results";

/**
 * Save experiment results to localStorage
 */
export function saveToLocalStorage(results: ExperimentResult[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

/**
 * Load experiment results from localStorage
 */
export function loadFromLocalStorage(): ExperimentResult[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    return JSON.parse(stored) as ExperimentResult[];
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return [];
  }
}

/**
 * Clear all stored results
 */
export function clearLocalStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}

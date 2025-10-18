import { ExperimentResult } from "@/types";

/**
 * Export experiment results as JSON
 */
export function exportAsJSON(results: ExperimentResult[]): string {
  return JSON.stringify(results, null, 2);
}

/**
 * Export experiment results as CSV
 */
export function exportAsCSV(results: ExperimentResult[]): string {
  if (results.length === 0) return "";

  const headers = [
    "ID",
    "Prompt",
    "Temperature",
    "Top P",
    "Response",
    "Coherence",
    "Length Score",
    "Completeness",
    "Timestamp",
  ];

  const rows = results.map((result) => [
    result.id,
    `"${result.prompt.replace(/"/g, '""')}"`,
    result.params.temperature?.toFixed(2) ?? "N/A",
    result.params.top_p?.toFixed(2) ?? "N/A",
    `"${result.response.replace(/"/g, '""')}"`,
    result.metrics.coherence.toFixed(3),
    result.metrics.lengthScore.toFixed(3),
    result.metrics.completeness.toFixed(3),
    new Date(result.timestamp).toISOString(),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

/**
 * Trigger download of a file in the browser
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

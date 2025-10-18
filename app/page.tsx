"use client";

import { useState } from "react";
import { PromptForm } from "@/components/prompt-form";
import { ExportActions } from "@/components/export-actions";
import { TestPromptsModal } from "@/components/test-prompts-modal";
import { ResultsModal } from "@/components/results-modal";
import { SavedRunsModal } from "@/components/saved-runs-modal";
import { ProtectedContent } from "@/components/protected-content";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PromptFormValues } from "@/lib/validation";
import { ExperimentResult, ExperimentRun } from "@/types";
import { TestPrompt } from "@/lib/test-prompts";
import { AlertCircle, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const [results, setResults] = useState<ExperimentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestPrompt, setSelectedTestPrompt] =
    useState<Partial<PromptFormValues> | null>(null);
  const { logout } = useAuth();

  const handleTestPromptSelect = (testPrompt: TestPrompt) => {
    const formValues: Partial<PromptFormValues> = {
      prompt: testPrompt.prompt,
      numResponses: 3,
      ...testPrompt.recommendedParams,
    };
    setSelectedTestPrompt(formValues);
  };

  const handleLoadRun = (run: ExperimentRun) => {
    setResults(run.results);
    // Optionally, you could also populate the form with the prompt from the run
    if (run.results.length > 0) {
      const formValues: Partial<PromptFormValues> = {
        prompt: run.results[0].prompt,
      };
      setSelectedTestPrompt(formValues);
    }
  };

  const handleSubmit = async (values: PromptFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const password = sessionStorage.getItem("app_password");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-password": password || "",
        },
        body: JSON.stringify({
          prompt: values.prompt,
          temperatureRange: [values.temperatureMin, values.temperatureMax],
          topPRange: [values.topPMin, values.topPMax],
          frequencyPenaltyRange: [
            values.frequencyPenaltyMin,
            values.frequencyPenaltyMax,
          ],
          presencePenaltyRange: [
            values.presencePenaltyMin,
            values.presencePenaltyMax,
          ],
          seed: values.seed,
          maxTokens: values.maxTokens,
          numResponses: values.numResponses,
          enableTemperature: values.enableTemperature,
          enableTopP: values.enableTopP,
          enableFrequencyPenalty: values.enableFrequencyPenalty,
          enablePresencePenalty: values.enablePresencePenalty,
          enableSeed: values.enableSeed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate responses");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate responses. Please check your API key and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedContent>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-4xl font-bold">
                  AI Response Quality Analyzer
                </h1>
              </div>
              <p className="text-muted-foreground mb-6">
                Compare LLM responses with different parameters and analyze
                quality metrics
              </p>

              {/* Modal Trigger Buttons */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <TestPromptsModal onSelectPrompt={handleTestPromptSelect} />
                <ResultsModal results={results} />
                <SavedRunsModal onLoadRun={handleLoadRun} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <PromptForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                initialValues={selectedTestPrompt || undefined}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <ExportActions results={results} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedContent>
  );
}

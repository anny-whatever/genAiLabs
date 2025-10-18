"use client";

import { testPrompts, TestPrompt } from "@/lib/test-prompts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface TestPromptsSelectorProps {
  onSelectPrompt: (prompt: TestPrompt) => void;
}

export function TestPromptsSelector({
  onSelectPrompt,
}: TestPromptsSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <CardTitle>Quick Test Prompts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Select a test prompt to quickly experiment with different parameter
          combinations and see how they affect the model's output.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {testPrompts.map((testPrompt) => (
            <Button
              key={testPrompt.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start text-left hover:bg-accent"
              onClick={() => onSelectPrompt(testPrompt)}
            >
              <div className="font-semibold text-sm mb-1">
                {testPrompt.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {testPrompt.description}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

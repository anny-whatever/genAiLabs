"use client";

import { useState } from "react";
import { testPrompts, TestPrompt } from "@/lib/test-prompts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lightbulb } from "lucide-react";

interface TestPromptsModalProps {
  onSelectPrompt: (prompt: TestPrompt) => void;
}

export function TestPromptsModal({ onSelectPrompt }: TestPromptsModalProps) {
  const [open, setOpen] = useState(false);

  const handleSelectPrompt = (prompt: TestPrompt) => {
    onSelectPrompt(prompt);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Quick Test Prompts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Quick Test Prompts
          </DialogTitle>
          <DialogDescription>
            Select a test prompt to quickly experiment with different parameter
            combinations and see how they affect the model's output.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testPrompts.map((testPrompt) => (
              <Button
                key={testPrompt.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left hover:bg-accent"
                onClick={() => handleSelectPrompt(testPrompt)}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

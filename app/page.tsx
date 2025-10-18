'use client';

import { useState } from 'react';
import { PromptForm } from '@/components/prompt-form';
import { PromptFormValues } from '@/lib/validation';
import { ExperimentResult } from '@/types';

export default function Home() {
  const [results, setResults] = useState<ExperimentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: PromptFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: values.prompt,
          temperatureRange: [values.temperatureMin, values.temperatureMax],
          topPRange: [values.topPMin, values.topPMax],
          numResponses: values.numResponses,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate responses');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate responses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              AI Response Quality Analyzer
            </h1>
            <p className="text-muted-foreground">
              Compare LLM responses with different parameters and analyze quality metrics
            </p>
          </div>
          
          <div className="space-y-8">
            <PromptForm onSubmit={handleSubmit} isLoading={isLoading} />
            
            {results.length > 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p>Generated {results.length} response(s). Results visualization coming in Phase 5.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

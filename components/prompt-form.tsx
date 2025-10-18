'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { promptFormSchema, PromptFormValues } from '@/lib/validation';

interface PromptFormProps {
  onSubmit: (values: PromptFormValues) => void;
  isLoading?: boolean;
}

export function PromptForm({ onSubmit, isLoading = false }: PromptFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      prompt: '',
      temperatureMin: 0.3,
      temperatureMax: 0.9,
      topPMin: 0.7,
      topPMax: 1.0,
      numResponses: 3,
    },
  });

  const temperatureMin = watch('temperatureMin');
  const temperatureMax = watch('temperatureMax');
  const topPMin = watch('topPMin');
  const topPMax = watch('topPMax');
  const numResponses = watch('numResponses');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiment Configuration</CardTitle>
        <CardDescription>
          Configure your prompt and parameters to generate multiple AI responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter your prompt here..."
              className="min-h-[100px]"
              {...register('prompt')}
            />
            {errors.prompt && (
              <p className="text-sm text-destructive">{errors.prompt.message}</p>
            )}
          </div>

          {/* Temperature Range */}
          <div className="space-y-3">
            <Label>
              Temperature Range: {temperatureMin.toFixed(2)} - {temperatureMax.toFixed(2)}
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Min:</span>
                <Slider
                  value={[temperatureMin]}
                  onValueChange={(value) => setValue('temperatureMin', value[0])}
                  min={0}
                  max={1}
                  step={0.05}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Max:</span>
                <Slider
                  value={[temperatureMax]}
                  onValueChange={(value) => setValue('temperatureMax', value[0])}
                  min={0}
                  max={1}
                  step={0.05}
                  className="flex-1"
                />
              </div>
            </div>
            {errors.temperatureMax && (
              <p className="text-sm text-destructive">{errors.temperatureMax.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Controls randomness. Lower = more focused, Higher = more creative
            </p>
          </div>

          {/* Top P Range */}
          <div className="space-y-3">
            <Label>
              Top P Range: {topPMin.toFixed(2)} - {topPMax.toFixed(2)}
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Min:</span>
                <Slider
                  value={[topPMin]}
                  onValueChange={(value) => setValue('topPMin', value[0])}
                  min={0}
                  max={1}
                  step={0.05}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Max:</span>
                <Slider
                  value={[topPMax]}
                  onValueChange={(value) => setValue('topPMax', value[0])}
                  min={0}
                  max={1}
                  step={0.05}
                  className="flex-1"
                />
              </div>
            </div>
            {errors.topPMax && (
              <p className="text-sm text-destructive">{errors.topPMax.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Nucleus sampling. Lower = more deterministic
            </p>
          </div>

          {/* Number of Responses */}
          <div className="space-y-3">
            <Label>Number of Responses: {numResponses}</Label>
            <Slider
              value={[numResponses]}
              onValueChange={(value) => setValue('numResponses', value[0])}
              min={1}
              max={5}
              step={1}
              className="flex-1"
            />
            <p className="text-xs text-muted-foreground">
              Generate {numResponses} response{numResponses > 1 ? 's' : ''} with different parameter combinations
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Responses'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


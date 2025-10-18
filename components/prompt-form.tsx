"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { promptFormSchema, PromptFormValues } from "@/lib/validation";
import { useEffect } from "react";

interface PromptFormProps {
  onSubmit: (values: PromptFormValues) => void;
  isLoading?: boolean;
  initialValues?: Partial<PromptFormValues>;
}

export function PromptForm({
  onSubmit,
  isLoading = false,
  initialValues,
}: PromptFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      prompt: "",
      temperatureMin: 0.3,
      temperatureMax: 0.9,
      topPMin: 0.7,
      topPMax: 1.0,
      frequencyPenaltyMin: 0,
      frequencyPenaltyMax: 0.5,
      presencePenaltyMin: 0,
      presencePenaltyMax: 0.5,
      seed: undefined,
      maxTokens: 500,
      numResponses: 3,
      enableTemperature: true,
      enableTopP: true,
      enableFrequencyPenalty: false,
      enablePresencePenalty: false,
      enableSeed: false,
    },
  });

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      Object.entries(initialValues).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof PromptFormValues, value);
        }
      });
    }
  }, [initialValues, setValue]);

  const temperatureMin = watch("temperatureMin");
  const temperatureMax = watch("temperatureMax");
  const topPMin = watch("topPMin");
  const topPMax = watch("topPMax");
  const frequencyPenaltyMin = watch("frequencyPenaltyMin");
  const frequencyPenaltyMax = watch("frequencyPenaltyMax");
  const presencePenaltyMin = watch("presencePenaltyMin");
  const presencePenaltyMax = watch("presencePenaltyMax");
  const maxTokens = watch("maxTokens");
  const numResponses = watch("numResponses");
  const enableTemperature = watch("enableTemperature");
  const enableTopP = watch("enableTopP");
  const enableFrequencyPenalty = watch("enableFrequencyPenalty");
  const enablePresencePenalty = watch("enablePresencePenalty");
  const enableSeed = watch("enableSeed");

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
              {...register("prompt")}
            />
            {errors.prompt && (
              <p className="text-sm text-destructive">
                {errors.prompt.message}
              </p>
            )}
          </div>

          {/* Temperature Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Temperature Range: {temperatureMin.toFixed(2)} -{" "}
                {temperatureMax.toFixed(2)}
              </Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="enable-temperature" className="text-sm">
                  Enable
                </Label>
                <Switch
                  id="enable-temperature"
                  checked={enableTemperature}
                  onCheckedChange={(checked) =>
                    setValue("enableTemperature", checked)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Min:</span>
                <Slider
                  value={[temperatureMin]}
                  onValueChange={(value) =>
                    setValue("temperatureMin", value[0])
                  }
                  min={0}
                  max={1}
                  step={0.05}
                  className="flex-1"
                  disabled={!enableTemperature}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Max:</span>
                <Slider
                  value={[temperatureMax]}
                  onValueChange={(value) =>
                    setValue("temperatureMax", value[0])
                  }
                  min={0}
                  max={1}
                  step={0.05}
                  className="flex-1"
                  disabled={!enableTemperature}
                />
              </div>
            </div>
            {errors.temperatureMax && (
              <p className="text-sm text-destructive">
                {errors.temperatureMax.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Controls randomness. Lower = more focused, Higher = more creative
            </p>
          </div>

          {/* Top P Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Top P Range: {topPMin.toFixed(2)} - {topPMax.toFixed(2)}
              </Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="enable-topP" className="text-sm">
                  Enable
                </Label>
                <Switch
                  id="enable-topP"
                  checked={enableTopP}
                  onCheckedChange={(checked) => setValue("enableTopP", checked)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Min:</span>
                <Slider
                  value={[topPMin]}
                  onValueChange={(value) => setValue("topPMin", value[0])}
                  min={0}
                  max={1}
                  step={0.05}
                  className="flex-1"
                  disabled={!enableTopP}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Max:</span>
                <Slider
                  value={[topPMax]}
                  onValueChange={(value) => setValue("topPMax", value[0])}
                  min={0}
                  max={1}
                  step={0.05}
                  className="flex-1"
                  disabled={!enableTopP}
                />
              </div>
            </div>
            {errors.topPMax && (
              <p className="text-sm text-destructive">
                {errors.topPMax.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Nucleus sampling. Lower = more deterministic
            </p>
          </div>

          {/* Frequency Penalty Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Frequency Penalty Range: {frequencyPenaltyMin.toFixed(2)} -{" "}
                {frequencyPenaltyMax.toFixed(2)}
              </Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="enable-frequency" className="text-sm">
                  Enable
                </Label>
                <Switch
                  id="enable-frequency"
                  checked={enableFrequencyPenalty}
                  onCheckedChange={(checked) =>
                    setValue("enableFrequencyPenalty", checked)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Min:</span>
                <Slider
                  value={[frequencyPenaltyMin]}
                  onValueChange={(value) =>
                    setValue("frequencyPenaltyMin", value[0])
                  }
                  min={-2}
                  max={2}
                  step={0.1}
                  className="flex-1"
                  disabled={!enableFrequencyPenalty}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Max:</span>
                <Slider
                  value={[frequencyPenaltyMax]}
                  onValueChange={(value) =>
                    setValue("frequencyPenaltyMax", value[0])
                  }
                  min={-2}
                  max={2}
                  step={0.1}
                  className="flex-1"
                  disabled={!enableFrequencyPenalty}
                />
              </div>
            </div>
            {errors.frequencyPenaltyMax && (
              <p className="text-sm text-destructive">
                {errors.frequencyPenaltyMax.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Reduces token repetition. Higher = less repetition
            </p>
          </div>

          {/* Presence Penalty Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Presence Penalty Range: {presencePenaltyMin.toFixed(2)} -{" "}
                {presencePenaltyMax.toFixed(2)}
              </Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="enable-presence" className="text-sm">
                  Enable
                </Label>
                <Switch
                  id="enable-presence"
                  checked={enablePresencePenalty}
                  onCheckedChange={(checked) =>
                    setValue("enablePresencePenalty", checked)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Min:</span>
                <Slider
                  value={[presencePenaltyMin]}
                  onValueChange={(value) =>
                    setValue("presencePenaltyMin", value[0])
                  }
                  min={-2}
                  max={2}
                  step={0.1}
                  className="flex-1"
                  disabled={!enablePresencePenalty}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Max:</span>
                <Slider
                  value={[presencePenaltyMax]}
                  onValueChange={(value) =>
                    setValue("presencePenaltyMax", value[0])
                  }
                  min={-2}
                  max={2}
                  step={0.1}
                  className="flex-1"
                  disabled={!enablePresencePenalty}
                />
              </div>
            </div>
            {errors.presencePenaltyMax && (
              <p className="text-sm text-destructive">
                {errors.presencePenaltyMax.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Encourages new topics. Higher = more diverse topics
            </p>
          </div>

          {/* Seed Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="seed">Seed (Optional)</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="enable-seed" className="text-sm">
                  Enable
                </Label>
                <Switch
                  id="enable-seed"
                  checked={enableSeed}
                  onCheckedChange={(checked) => setValue("enableSeed", checked)}
                />
              </div>
            </div>
            <input
              id="seed"
              type="number"
              placeholder="Leave empty for random"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!enableSeed}
              {...register("seed", { valueAsNumber: true })}
            />
            {errors.seed && (
              <p className="text-sm text-destructive">{errors.seed.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Set a seed for deterministic outputs (useful for testing)
            </p>
          </div>

          {/* Max Tokens Input */}
          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Tokens: {maxTokens}</Label>
            <Slider
              id="maxTokens"
              value={[maxTokens]}
              onValueChange={(value) => setValue("maxTokens", value[0])}
              min={50}
              max={16000}
              step={50}
              className="flex-1"
            />
            {errors.maxTokens && (
              <p className="text-sm text-destructive">
                {errors.maxTokens.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Maximum number of tokens to generate in the response
            </p>
          </div>

          {/* Number of Responses */}
          <div className="space-y-3">
            <Label>Number of Responses: {numResponses}</Label>
            <Slider
              value={[numResponses]}
              onValueChange={(value) => setValue("numResponses", value[0])}
              min={1}
              max={5}
              step={1}
              className="flex-1"
            />
            <p className="text-xs text-muted-foreground">
              Generate {numResponses} response{numResponses > 1 ? "s" : ""} with
              different parameter combinations
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
              "Generate Responses"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

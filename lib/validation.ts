import * as z from "zod";

export const promptFormSchema = z
  .object({
    prompt: z.string().min(10, "Prompt must be at least 10 characters"),
    temperatureMin: z.number().min(0).max(1),
    temperatureMax: z.number().min(0).max(1),
    topPMin: z.number().min(0).max(1),
    topPMax: z.number().min(0).max(1),
    frequencyPenaltyMin: z.number().min(-2).max(2),
    frequencyPenaltyMax: z.number().min(-2).max(2),
    presencePenaltyMin: z.number().min(-2).max(2),
    presencePenaltyMax: z.number().min(-2).max(2),
    seed: z.number().int().optional(),
    maxTokens: z.number().int().min(1).max(16000),
    numResponses: z.number().min(1).max(5).int(),
    enableTemperature: z.boolean(),
    enableTopP: z.boolean(),
    enableFrequencyPenalty: z.boolean(),
    enablePresencePenalty: z.boolean(),
    enableSeed: z.boolean(),
  })
  .refine((data) => data.temperatureMax >= data.temperatureMin, {
    message: "Temperature max must be >= min",
    path: ["temperatureMax"],
  })
  .refine((data) => data.topPMax >= data.topPMin, {
    message: "Top P max must be >= min",
    path: ["topPMax"],
  })
  .refine((data) => data.frequencyPenaltyMax >= data.frequencyPenaltyMin, {
    message: "Frequency Penalty max must be >= min",
    path: ["frequencyPenaltyMax"],
  })
  .refine((data) => data.presencePenaltyMax >= data.presencePenaltyMin, {
    message: "Presence Penalty max must be >= min",
    path: ["presencePenaltyMax"],
  });

export type PromptFormValues = z.infer<typeof promptFormSchema>;

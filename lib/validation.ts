import * as z from 'zod';

export const promptFormSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  temperatureMin: z.number().min(0).max(1),
  temperatureMax: z.number().min(0).max(1),
  topPMin: z.number().min(0).max(1),
  topPMax: z.number().min(0).max(1),
  numResponses: z.number().min(1).max(5).int(),
}).refine(
  (data) => data.temperatureMax >= data.temperatureMin,
  {
    message: 'Temperature max must be >= min',
    path: ['temperatureMax'],
  }
).refine(
  (data) => data.topPMax >= data.topPMin,
  {
    message: 'Top P max must be >= min',
    path: ['topPMax'],
  }
);

export type PromptFormValues = z.infer<typeof promptFormSchema>;


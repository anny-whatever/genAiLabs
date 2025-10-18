export interface GenerationParams {
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  seed?: number;
  max_tokens?: number;
}

export interface Metrics {
  coherence: number;
  lengthScore: number;
  completeness: number;
}

export interface ExperimentResult {
  id: string;
  prompt: string;
  params: GenerationParams;
  response: string;
  metrics: Metrics;
  timestamp: number;
}

export interface GenerateRequest {
  prompt: string;
  temperatureRange: [number, number];
  topPRange: [number, number];
  frequencyPenaltyRange: [number, number];
  presencePenaltyRange: [number, number];
  seed?: number;
  maxTokens: number;
  numResponses: number;
  enableTemperature: boolean;
  enableTopP: boolean;
  enableFrequencyPenalty: boolean;
  enablePresencePenalty: boolean;
  enableSeed: boolean;
}

export interface GenerateResponse {
  results: ExperimentResult[];
}

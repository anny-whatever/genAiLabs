export interface GenerationParams {
  temperature: number;
  top_p: number;
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
  numResponses: number;
}

export interface GenerateResponse {
  results: ExperimentResult[];
}


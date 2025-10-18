export interface GenerationParams {
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  seed?: number;
  max_tokens?: number;
  logprobs?: boolean;
  top_logprobs?: number;
  stop?: string[];
  n?: number;
}

export interface Metrics {
  coherence: number;
  lengthScore: number;
  completeness: number;
  confidence?: number; // avg token probability (0-1)
  entropy?: number; // response uncertainty (0-higher)
  perplexity?: number; // language model perplexity
  repetitionRatio?: number; // how repetitive the text is
  vocabularyRichness?: number; // unique words / total words
}

export interface ExperimentResult {
  id: string;
  prompt: string;
  params: GenerationParams;
  response: string;
  metrics: Metrics;
  timestamp: number;
  tokenLogprobs?: TokenLogprob[]; // token-level confidence data
  finishReason?: string;
  responseTime?: number; // milliseconds
}

export interface ExperimentRun {
  id: string;
  name: string;
  timestamp: number;
  results: ExperimentResult[];
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

export interface TokenLogprob {
  token: string;
  logprob: number;
  probability: number;
  topLogprobs?: Array<{
    token: string;
    logprob: number;
    probability: number;
  }>;
}

export interface GenerateResponse {
  results: ExperimentResult[];
}

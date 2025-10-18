export interface TestPrompt {
  id: string;
  title: string;
  prompt: string;
  description: string;
  recommendedParams: {
    enableTemperature?: boolean;
    temperatureMin?: number;
    temperatureMax?: number;
    enableTopP?: boolean;
    topPMin?: number;
    topPMax?: number;
    enableFrequencyPenalty?: boolean;
    frequencyPenaltyMin?: number;
    frequencyPenaltyMax?: number;
    enablePresencePenalty?: boolean;
    presencePenaltyMin?: number;
    presencePenaltyMax?: number;
    enableSeed?: boolean;
    seed?: number;
    maxTokens?: number;
  };
}

export const testPrompts: TestPrompt[] = [
  {
    id: "creativity-test",
    title: "Creativity Test",
    prompt: "Write a creative short story about a robot learning to paint",
    description:
      "Tests how temperature affects creativity. Higher temp = more creative.",
    recommendedParams: {
      enableTemperature: true,
      temperatureMin: 0.3,
      temperatureMax: 1.0,
      enableTopP: true,
      topPMin: 0.8,
      topPMax: 1.0,
      maxTokens: 300,
    },
  },
  {
    id: "factual-test",
    title: "Factual Accuracy Test",
    prompt: "Explain how photosynthesis works in plants",
    description:
      "Tests factual consistency. Lower temp = more focused and accurate.",
    recommendedParams: {
      enableTemperature: true,
      temperatureMin: 0.1,
      temperatureMax: 0.5,
      enableTopP: true,
      topPMin: 0.5,
      topPMax: 0.8,
      maxTokens: 250,
    },
  },
  {
    id: "repetition-test",
    title: "Repetition Control Test",
    prompt:
      "List 10 different ways to say 'hello' in various contexts and explain when to use each",
    description:
      "Tests frequency penalty. Higher penalty reduces word repetition.",
    recommendedParams: {
      enableTemperature: true,
      temperatureMin: 0.5,
      temperatureMax: 0.7,
      enableFrequencyPenalty: true,
      frequencyPenaltyMin: 0,
      frequencyPenaltyMax: 1.5,
      maxTokens: 400,
    },
  },
  {
    id: "topic-diversity-test",
    title: "Topic Diversity Test",
    prompt:
      "Discuss the importance of technology in modern society covering multiple aspects",
    description:
      "Tests presence penalty. Higher penalty encourages exploring new topics.",
    recommendedParams: {
      enableTemperature: true,
      temperatureMin: 0.6,
      temperatureMax: 0.8,
      enablePresencePenalty: true,
      presencePenaltyMin: 0,
      presencePenaltyMax: 1.0,
      maxTokens: 350,
    },
  },
  {
    id: "determinism-test",
    title: "Determinism Test",
    prompt: "Generate a random password policy with 5 rules",
    description:
      "Tests seed parameter. Same seed = identical outputs across runs.",
    recommendedParams: {
      enableTemperature: true,
      temperatureMin: 0.7,
      temperatureMax: 0.7,
      enableTopP: true,
      topPMin: 0.9,
      topPMax: 0.9,
      enableSeed: true,
      maxTokens: 200,
    },
  },
  {
    id: "conciseness-test",
    title: "Conciseness Test",
    prompt: "Explain quantum computing in simple terms",
    description: "Tests max_tokens effect on response length and conciseness.",
    recommendedParams: {
      enableTemperature: true,
      temperatureMin: 0.4,
      temperatureMax: 0.6,
      maxTokens: 100,
    },
  },
  {
    id: "code-generation-test",
    title: "Code Generation Test",
    prompt:
      "Write a Python function that finds the longest palindrome in a string",
    description:
      "Tests focused output for code. Low temp + low top_p = precise code.",
    recommendedParams: {
      enableTemperature: true,
      temperatureMin: 0.2,
      temperatureMax: 0.4,
      enableTopP: true,
      topPMin: 0.3,
      topPMax: 0.6,
      maxTokens: 300,
    },
  },
  {
    id: "balanced-test",
    title: "Balanced Output Test",
    prompt: "Write a balanced argument about the pros and cons of remote work",
    description:
      "Tests balanced parameters for well-rounded, comprehensive output.",
    recommendedParams: {
      enableTemperature: true,
      temperatureMin: 0.5,
      temperatureMax: 0.7,
      enableTopP: true,
      topPMin: 0.7,
      topPMax: 0.9,
      enableFrequencyPenalty: true,
      frequencyPenaltyMin: 0.2,
      frequencyPenaltyMax: 0.5,
      enablePresencePenalty: true,
      presencePenaltyMin: 0.1,
      presencePenaltyMax: 0.3,
      maxTokens: 400,
    },
  },
  {
    id: "extreme-creativity-test",
    title: "Extreme Creativity Test",
    prompt: "Invent a new sport that combines three existing sports",
    description:
      "Tests maximum creativity with high temperature and penalties for diverse ideas.",
    recommendedParams: {
      enableTemperature: true,
      temperatureMin: 0.8,
      temperatureMax: 1.0,
      enableTopP: true,
      topPMin: 0.9,
      topPMax: 1.0,
      enablePresencePenalty: true,
      presencePenaltyMin: 0.5,
      presencePenaltyMax: 1.0,
      maxTokens: 350,
    },
  },
  {
    id: "minimal-params-test",
    title: "Minimal Parameters Test",
    prompt: "What is artificial intelligence?",
    description:
      "Tests with all advanced parameters disabled. Only basic generation.",
    recommendedParams: {
      enableTemperature: false,
      enableTopP: false,
      enableFrequencyPenalty: false,
      enablePresencePenalty: false,
      enableSeed: false,
      maxTokens: 200,
    },
  },
];

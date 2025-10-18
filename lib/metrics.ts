import { Metrics, TokenLogprob } from "@/types";

/**
 * Calculate coherence score based on word repetition and sentence structure
 * Higher score = better coherence
 */
function calculateCoherence(text: string): number {
  if (!text || text.length === 0) return 0;

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length === 0) return 0;

  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);

  // Penalize excessive repetition
  const repetitionScore = uniqueWords.size / words.length;

  // Reward balanced sentence lengths
  const avgSentenceLength = words.length / sentences.length;
  const lengthBalanceScore = Math.min(avgSentenceLength / 15, 1);

  // Combine scores
  const coherenceScore = repetitionScore * 0.6 + lengthBalanceScore * 0.4;

  return Math.min(Math.max(coherenceScore, 0), 1);
}

/**
 * Calculate length appropriateness score
 * Compares response length to a target range (50-400 words)
 */
function calculateLengthScore(text: string): number {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  const minIdeal = 50;
  const maxIdeal = 400;

  if (wordCount < minIdeal) {
    return wordCount / minIdeal;
  } else if (wordCount > maxIdeal) {
    return Math.max(0, 1 - (wordCount - maxIdeal) / maxIdeal);
  }

  return 1;
}

/**
 * Calculate completeness score based on keyword coverage from prompt
 * Higher score = more keywords from prompt are addressed in response
 */
function calculateCompleteness(prompt: string, response: string): number {
  if (!prompt || !response) return 0;

  // Extract meaningful keywords from prompt (filter out common words)
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "can",
    "what",
    "how",
    "when",
    "where",
    "why",
    "who",
    "which",
    "this",
    "that",
    "these",
    "those",
  ]);

  const promptWords = prompt
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3 && !commonWords.has(w));

  if (promptWords.length === 0) return 1;

  const responseLower = response.toLowerCase();
  const matchedKeywords = promptWords.filter((word) =>
    responseLower.includes(word)
  );

  const coverageScore = matchedKeywords.length / promptWords.length;

  return Math.min(Math.max(coverageScore, 0), 1);
}

/**
 * Calculate average confidence from token logprobs
 * Higher score = model is more confident in its tokens
 */
function calculateConfidence(
  tokenLogprobs?: TokenLogprob[]
): number | undefined {
  if (!tokenLogprobs || tokenLogprobs.length === 0) return undefined;

  const avgProbability =
    tokenLogprobs.reduce((sum, lp) => sum + lp.probability, 0) /
    tokenLogprobs.length;

  return avgProbability;
}

/**
 * Calculate Shannon entropy from token probabilities
 * Higher entropy = more uncertain/varied predictions
 */
function calculateEntropy(tokenLogprobs?: TokenLogprob[]): number | undefined {
  if (!tokenLogprobs || tokenLogprobs.length === 0) return undefined;

  let totalEntropy = 0;

  for (const lp of tokenLogprobs) {
    if (lp.topLogprobs && lp.topLogprobs.length > 0) {
      // Calculate entropy from top_logprobs distribution
      const entropy = -lp.topLogprobs.reduce((sum, tlp) => {
        if (tlp.probability > 0) {
          return sum + tlp.probability * Math.log2(tlp.probability);
        }
        return sum;
      }, 0);
      totalEntropy += entropy;
    }
  }

  return totalEntropy / tokenLogprobs.length;
}

/**
 * Estimate perplexity from average logprob
 * Lower perplexity = better language model fit
 */
function calculatePerplexity(
  tokenLogprobs?: TokenLogprob[]
): number | undefined {
  if (!tokenLogprobs || tokenLogprobs.length === 0) return undefined;

  const avgLogprob =
    tokenLogprobs.reduce((sum, lp) => sum + lp.logprob, 0) /
    tokenLogprobs.length;

  // Perplexity = exp(-avg_logprob)
  return Math.exp(-avgLogprob);
}

/**
 * Calculate repetition ratio (n-gram based)
 * Lower is better - measures how repetitive the text is
 */
function calculateRepetitionRatio(text: string): number {
  if (!text || text.length === 0) return 0;

  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  if (words.length < 4) return 0;

  // Calculate bigram repetition
  const bigrams = new Set<string>();
  const bigramCounts = new Map<string, number>();

  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    bigrams.add(bigram);
    bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
  }

  // Count repeated bigrams
  let repeatedCount = 0;
  for (const count of bigramCounts.values()) {
    if (count > 1) repeatedCount += count - 1;
  }

  const repetitionRatio =
    words.length > 1 ? repeatedCount / (words.length - 1) : 0;

  return Math.min(repetitionRatio, 1);
}

/**
 * Calculate vocabulary richness (unique words / total words)
 * Higher is better - measures lexical diversity
 */
function calculateVocabularyRichness(text: string): number {
  if (!text || text.length === 0) return 0;

  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  if (words.length === 0) return 0;

  const uniqueWords = new Set(words);

  return uniqueWords.size / words.length;
}

/**
 * Calculate all metrics for a given prompt-response pair
 */
export function calculateMetrics(
  prompt: string,
  response: string,
  tokenLogprobs?: TokenLogprob[]
): Metrics {
  return {
    coherence: calculateCoherence(response),
    lengthScore: calculateLengthScore(response),
    completeness: calculateCompleteness(prompt, response),
    confidence: calculateConfidence(tokenLogprobs),
    entropy: calculateEntropy(tokenLogprobs),
    perplexity: calculatePerplexity(tokenLogprobs),
    repetitionRatio: calculateRepetitionRatio(response),
    vocabularyRichness: calculateVocabularyRichness(response),
  };
}

/**
 * Get a human-readable description of a metric
 */
export function getMetricDescription(metric: keyof Metrics): string {
  const descriptions: Record<keyof Metrics, string> = {
    coherence:
      "Measures text flow and word diversity. Penalizes repetition and rewards balanced sentence structure.",
    lengthScore:
      "Evaluates if response length is appropriate (ideal: 50-400 words).",
    completeness:
      "Checks how many keywords from the prompt are covered in the response.",
    confidence:
      "Average token probability - how confident the model is in its predictions (higher = more certain).",
    entropy:
      "Shannon entropy of token distributions - measures prediction uncertainty (lower = more focused).",
    perplexity:
      "Language model perplexity - how well the model predicts its own output (lower = better fit).",
    repetitionRatio:
      "Measures how repetitive the text is using n-gram analysis (lower = less repetitive).",
    vocabularyRichness:
      "Ratio of unique words to total words - lexical diversity (higher = richer vocabulary).",
  };

  return descriptions[metric] || "Unknown metric";
}

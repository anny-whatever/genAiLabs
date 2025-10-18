import { Metrics } from '@/types';

/**
 * Calculate coherence score based on word repetition and sentence structure
 * Higher score = better coherence
 */
function calculateCoherence(text: string): number {
  if (!text || text.length === 0) return 0;

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;

  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  
  // Penalize excessive repetition
  const repetitionScore = uniqueWords.size / words.length;
  
  // Reward balanced sentence lengths
  const avgSentenceLength = words.length / sentences.length;
  const lengthBalanceScore = Math.min(avgSentenceLength / 15, 1);
  
  // Combine scores
  const coherenceScore = (repetitionScore * 0.6) + (lengthBalanceScore * 0.4);
  
  return Math.min(Math.max(coherenceScore, 0), 1);
}

/**
 * Calculate length appropriateness score
 * Compares response length to a target range (50-400 words)
 */
function calculateLengthScore(text: string): number {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  const minIdeal = 50;
  const maxIdeal = 400;
  
  if (wordCount < minIdeal) {
    return wordCount / minIdeal;
  } else if (wordCount > maxIdeal) {
    return Math.max(0, 1 - ((wordCount - maxIdeal) / maxIdeal));
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
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'can', 'what', 'how',
    'when', 'where', 'why', 'who', 'which', 'this', 'that', 'these', 'those'
  ]);
  
  const promptWords = prompt
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 3 && !commonWords.has(w));
  
  if (promptWords.length === 0) return 1;
  
  const responseLower = response.toLowerCase();
  const matchedKeywords = promptWords.filter(word => 
    responseLower.includes(word)
  );
  
  const coverageScore = matchedKeywords.length / promptWords.length;
  
  return Math.min(Math.max(coverageScore, 0), 1);
}

/**
 * Calculate all metrics for a given prompt-response pair
 */
export function calculateMetrics(prompt: string, response: string): Metrics {
  return {
    coherence: calculateCoherence(response),
    lengthScore: calculateLengthScore(response),
    completeness: calculateCompleteness(prompt, response),
  };
}

/**
 * Get a human-readable description of a metric
 */
export function getMetricDescription(metric: keyof Metrics): string {
  const descriptions = {
    coherence: 'Measures text flow and word diversity. Penalizes repetition.',
    lengthScore: 'Evaluates response length appropriateness (50-400 words ideal).',
    completeness: 'Ratio of prompt keywords addressed in the response.',
  };
  
  return descriptions[metric];
}


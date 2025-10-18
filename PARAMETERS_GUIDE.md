# OpenAI Parameters & Evaluation Metrics Guide

## 🎯 Sampling Parameters

### Temperature (0.0 - 2.0)

**Controls randomness/creativity of responses**

- **0.0**: Deterministic, always picks highest probability token
- **0.3-0.5**: Focused, consistent responses (good for factual tasks)
- **0.7-0.9**: Balanced creativity and coherence
- **1.0+**: High creativity, unpredictable (risky for production)

**How it works**:

```
P(token) = softmax(logits / temperature)
```

Lower temp → sharper probability distribution → more predictable
Higher temp → flatter distribution → more diverse

---

### Top-P / Nucleus Sampling (0.0 - 1.0)

**Limits token selection to top cumulative probability**

- **0.1**: Very restrictive, only most likely tokens
- **0.5**: Moderate diversity
- **0.9-0.95**: High diversity while filtering tail
- **1.0**: No filtering (uses all tokens)

**How it works**:
Sorts tokens by probability, selects from top tokens until cumulative probability ≥ top_p

**Example** (top_p = 0.9):

```
Token A: 60% ✅
Token B: 25% ✅ (cumulative 85%)
Token C: 10% ✅ (cumulative 95% > 90%, STOP)
Token D: 5%  ❌ excluded
```

---

### Frequency Penalty (-2.0 to 2.0)

**Penalizes tokens based on how MANY times they appeared**

**Formula**: `penalty = frequency_penalty × (token_count_in_response / total_tokens)`

**How it works**:

- Tracks each token's occurrence count
- Applies **escalating** penalty (more occurrences = stronger penalty)
- Negative logit bias reduces probability of selection

**Examples**:

**frequency_penalty = 0.5:**

```
"The cat sat on the mat. The dog..."
          ↓
1st "the": penalty = 0.5 × 1 = -0.5
2nd "the": penalty = 0.5 × 2 = -1.0 (stronger!)
3rd "the": penalty = 0.5 × 3 = -1.5 (even stronger!)
```

**frequency_penalty = -0.3** (encourage repetition):

```
Makes model MORE likely to repeat tokens
Useful for poetry, mantras, stylistic repetition
```

**Use Cases**:

- **0.3-0.7**: Reduce repetitive phrasing, prevent loops
- **0.8-1.5**: Strong anti-repetition (creative writing)
- **Negative**: Intentional repetition (rare)

---

### Presence Penalty (-2.0 to 2.0)

**Penalizes tokens that appeared AT ALL (binary)**

**Formula**: `penalty = presence_penalty × (1 if token_exists_in_response else 0)`

**How it works**:

- Tracks which tokens have appeared (binary: yes/no)
- Applies **fixed** penalty regardless of frequency
- Encourages exploring new vocabulary

**Examples**:

**presence_penalty = 0.6:**

```
"The cat sat on the mat"
     ↓              ↓
"cat": -0.6 penalty after 1st occurrence
"mat": -0.6 penalty after 1st occurrence
(Same penalty whether it appeared 1x or 100x)
```

**presence_penalty = -0.4** (encourage reusing words):

```
Makes model MORE likely to reuse introduced concepts
```

**Use Cases**:

- **0.3-0.7**: Encourage topic/vocabulary diversity
- **0.8-1.5**: Force exploring new concepts/words
- **Negative**: Stay on topic, reuse terminology (rare)

---

### Key Difference: Frequency vs Presence

| Aspect           | Frequency Penalty             | Presence Penalty             |
| ---------------- | ----------------------------- | ---------------------------- |
| **Question**     | "How OFTEN?"                  | "At all?"                    |
| **Penalty Type** | Escalating (linear)           | Fixed (binary)               |
| **Formula**      | `freq × count`                | `pres × (exists ? 1 : 0)`    |
| **Best For**     | Preventing repetitive phrases | Encouraging topic diversity  |
| **Example**      | Word appears 5x → 5× penalty  | Word appears 5x → 1× penalty |

**Practical Combinations**:

```typescript
// Reduce repetition within response
{ frequency_penalty: 0.5, presence_penalty: 0.0 }

// Encourage diverse topics
{ frequency_penalty: 0.0, presence_penalty: 0.6 }

// Creative writing (both)
{ frequency_penalty: 0.7, presence_penalty: 0.5 }

// Consistent technical output
{ frequency_penalty: 0.0, presence_penalty: 0.0 }
```

---

### Seed (integer)

**Enables deterministic outputs**

- Same seed + same params → same output (mostly)
- Useful for reproducibility, A/B testing, debugging
- **Note**: Not 100% deterministic across API versions/infrastructure

---

## 🔍 Advanced Evaluation Parameters

### Logprobs & Top_Logprobs

**Get token-level probability data**

```typescript
{
  logprobs: true,        // Enable logprob output
  top_logprobs: 5        // Get top 5 alternatives per token
}
```

**Returns**:

```json
{
  "token": "Paris",
  "logprob": -0.03,
  "probability": 0.97,
  "topLogprobs": [
    {"token": "Paris", "logprob": -0.03, "probability": 0.97},
    {"token": "London", "logprob": -3.51, "probability": 0.03},
    ...
  ]
}
```

**Use Cases**:

- **Confidence scoring**: Avg probability → model certainty
- **Uncertainty detection**: High entropy → uncertain predictions
- **Perplexity**: Model quality metric
- **Alternative analysis**: What else could it have said?

---

## 📊 Enhanced Metrics

### 1. Confidence Score (0-1)

**Average token probability**

```typescript
confidence = Σ(token_probabilities) / num_tokens;
```

- **> 0.9**: Very confident
- **0.7-0.9**: Moderate confidence
- **< 0.7**: Low confidence (check output!)

---

### 2. Shannon Entropy

**Prediction uncertainty**

```typescript
entropy = -Σ(p(token) × log₂(p(token)))
```

- **Low (0-2)**: Focused, deterministic predictions
- **High (>3)**: Uncertain, many alternatives considered

---

### 3. Perplexity

**Language model fit quality**

```typescript
perplexity = exp(-avg_logprob);
```

- **Low (<10)**: Model fits well, natural output
- **High (>50)**: Model struggles, unnatural output

---

### 4. Repetition Ratio (0-1)

**N-gram repetition analysis**

Measures bigram/trigram repetition:

- **< 0.2**: Low repetition ✅
- **0.2-0.4**: Moderate repetition
- **> 0.4**: High repetition (potential issue)

---

### 5. Vocabulary Richness (0-1)

**Lexical diversity**

```typescript
richness = unique_words / total_words;
```

- **> 0.7**: Rich vocabulary ✅
- **0.5-0.7**: Moderate diversity
- **< 0.5**: Limited vocabulary

---

## 🚀 Reliability Improvements

### 1. Exponential Backoff Retries

```typescript
delay = baseDelay × 2^attempt + random_jitter
```

**Handles**:

- Rate limits (429)
- Transient network errors
- API timeouts
- Server errors (500s)

**Config**:

- Max retries: 3
- Base delay: 1000ms
- Jitter: 0-1000ms random

---

### 2. Timeout Protection

- **Request timeout**: 60s
- Prevents hanging requests
- Fast failure detection

---

### 3. Error Classification

**Non-retryable** (fail fast):

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

**Retryable**:

- 429 Rate Limit
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable
- Network errors

---

## 🎨 Parameter Tuning Recipes

### Creative Writing

```typescript
{
  temperature: 0.9,
  top_p: 0.95,
  frequency_penalty: 0.7,
  presence_penalty: 0.6
}
```

### Technical Documentation

```typescript
{
  temperature: 0.3,
  top_p: 0.9,
  frequency_penalty: 0.2,
  presence_penalty: 0.1
}
```

### Chatbot (Natural)

```typescript
{
  temperature: 0.7,
  top_p: 0.9,
  frequency_penalty: 0.4,
  presence_penalty: 0.3
}
```

### Code Generation

```typescript
{
  temperature: 0.2,
  top_p: 0.95,
  frequency_penalty: 0.0,
  presence_penalty: 0.0
}
```

### Brainstorming

```typescript
{
  temperature: 1.2,
  top_p: 0.95,
  frequency_penalty: 0.8,
  presence_penalty: 0.7
}
```

### Consistent Outputs

```typescript
{
  temperature: 0.0,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  seed: 42
}
```

---

## 📈 Evaluation Best Practices

### 1. Always Enable Logprobs for Eval

```typescript
{ logprobs: true, top_logprobs: 5 }
```

### 2. Track Multiple Metrics

Don't rely on single score:

- Coherence (readability)
- Confidence (model certainty)
- Completeness (prompt coverage)
- Repetition (quality check)
- Vocabulary richness (diversity)

### 3. Set Baselines

Run with default params first:

```typescript
{
  temperature: 0.7,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0
}
```

### 4. A/B Test Changes

Use same seed for fair comparison:

```typescript
const seed = 42;
// Run config A with seed
// Run config B with seed
// Compare metrics
```

### 5. Monitor Response Time

High latency indicators:

- Long max_tokens
- Complex prompts
- Model overload

---

## 🔬 Debugging Poor Outputs

| Symptom         | Likely Cause         | Fix                                  |
| --------------- | -------------------- | ------------------------------------ |
| Repetitive text | Low penalties        | Increase frequency_penalty (0.5-1.0) |
| Off-topic       | Low presence penalty | Increase presence_penalty (0.5-0.8)  |
| Inconsistent    | High temperature     | Lower temperature (0.3-0.5)          |
| Boring/generic  | Low diversity        | Increase temperature/top_p           |
| Low confidence  | Wrong params         | Check logprobs, adjust temp          |
| High perplexity | Unnatural output     | Lower temperature, adjust prompts    |
| Truncated       | Token limit          | Increase max_tokens                  |

---

## 📚 References

- [OpenAI API Docs](https://platform.openai.com/docs/api-reference/chat/create)
- [Temperature vs Top-P](https://docs.cohere.com/docs/controlling-generation-with-top-k-top-p)
- [Shannon Entropy](<https://en.wikipedia.org/wiki/Entropy_(information_theory)>)
- [Perplexity](https://huggingface.co/docs/transformers/perplexity)

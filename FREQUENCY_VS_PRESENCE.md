# Frequency vs Presence Penalty - Visual Guide

## 🎯 The Core Question

| Penalty Type  | Question It Asks                          |
| ------------- | ----------------------------------------- |
| **Frequency** | "How MANY times has this token appeared?" |
| **Presence**  | "Has this token appeared AT ALL?"         |

---

## 📊 How They Work

### Frequency Penalty: Escalating Punishment

```
Token count:    1      2      3      4      5
                ↓      ↓      ↓      ↓      ↓
Penalty (0.5):  -0.5   -1.0   -1.5   -2.0   -2.5

The more you use it, the STRONGER the penalty gets!
```

**Formula**: `penalty = frequency_penalty × (token_count / total_tokens)`

### Presence Penalty: Binary Punishment

```
Token count:    1      2      3      4      5
                ↓      ↓      ↓      ↓      ↓
Penalty (0.5):  -0.5   -0.5   -0.5   -0.5   -0.5

Used once or 100 times = SAME penalty!
```

**Formula**: `penalty = presence_penalty × (1 if exists else 0)`

---

## 📝 Real Example

### Input Prompt:

"Write about cats and dogs"

### Scenario 1: No Penalties

```
"The cat is cute. The cat is fluffy. The cat is friendly. The cat..."
```

❌ Repetitive!

### Scenario 2: Frequency Penalty = 0.8

```
"The cat is cute. Felines are fluffy. These animals are friendly..."
```

✅ Varied phrasing (avoids repeating "cat")

### Scenario 3: Presence Penalty = 0.8

```
"Cats are cute. Dogs bark loudly. Pets need care. Animals..."
```

✅ Topic diversity (introduces new words)

### Scenario 4: Both (freq=0.6, pres=0.6)

```
"Cats have whiskers. Dogs wag tails. Felines purr softly. Canines play fetch..."
```

✅ Varied phrasing + diverse topics

---

## 🔢 Penalty Value Examples

### Temperature = 0.7, No Penalties

```
"I love pizza. I love pizza. I love pizza so much!"
```

### Frequency = 0.5

```
"I love pizza. I enjoy pizza. Pizza is great!"
```

(Reduces "I love" repetition)

### Presence = 0.5

```
"I love pizza. Pasta is also good. Italian food rocks!"
```

(Explores new topics beyond "pizza")

### Frequency = 1.0, Presence = 1.0

```
"I love pizza! Pasta tastes delicious. Burgers satisfy hunger. Sushi brings joy."
```

(Maximum diversity)

---

## 🎨 Visual Penalty Application

### Example Text: "The cat sat on the mat. The..."

#### With Frequency Penalty (0.5):

```
Token:      "The"   "cat"   "sat"   "on"   "the"   "mat"   "The"
Count:        1       1       1       1      2       1       3
Penalty:    -0.5    -0.5    -0.5    -0.5   -1.0    -0.5    -1.5
            ↓                                ↓                ↓
         Normal          Growing penalty...          Even stronger!
```

#### With Presence Penalty (0.5):

```
Token:      "The"   "cat"   "sat"   "on"   "the"   "mat"   "The"
Present:     Yes     Yes     Yes     Yes     Yes     Yes     Yes
Penalty:    -0.5    -0.5    -0.5    -0.5   -0.5    -0.5    -0.5
            ↓                                ↓                ↓
         Same           Same penalty           Still same!
```

---

## 🎭 Use Case Scenarios

### Creative Writing (Blog Post)

```typescript
{
  temperature: 0.8,
  frequency_penalty: 0.7,  // ← Avoid repetitive phrases
  presence_penalty: 0.6     // ← Explore diverse topics
}
```

**Result**: Rich vocabulary, varied sentence structures, explores subtopics

---

### Technical Documentation

```typescript
{
  temperature: 0.3,
  frequency_penalty: 0.2,  // ← Allow some repetition of terms
  presence_penalty: 0.1     // ← Stay on main topic
}
```

**Result**: Consistent terminology, focused content

---

### Poetry/Song Lyrics

```typescript
{
  temperature: 0.9,
  frequency_penalty: -0.3, // ← ENCOURAGE repetition (chorus)
  presence_penalty: 0.4     // ← But vary vocabulary
}
```

**Result**: Repetitive structure (good for songs), but with word variety

---

### Chatbot Responses

```typescript
{
  temperature: 0.7,
  frequency_penalty: 0.5,  // ← Don't repeat yourself
  presence_penalty: 0.3     // ← Moderate topic variety
}
```

**Result**: Natural, non-repetitive conversation

---

## 🧪 Interactive Examples

### Test 1: Describe a sunset

**No penalties** (temp=0.7):

```
"The sun is beautiful. The sun is orange. The sun is setting.
The sky is pretty. The sky is colorful."
```

😐 Boring, repetitive structure

**Frequency = 0.6**:

```
"The sun is beautiful. Its orange glow fills the horizon.
A colorful sky emerges as day transitions to evening."
```

😊 Better variety

**Frequency = 0.6, Presence = 0.6**:

```
"The sun descends below the horizon. Orange hues paint the sky.
Clouds reflect golden light while birds return home."
```

🤩 Rich, diverse, engaging

---

### Test 2: Explain recursion

**No penalties**:

```
"Recursion is when a function calls itself.
Recursion is useful. Recursion is powerful."
```

😐 Repetitive

**Frequency = 0.5**:

```
"Recursion is when a function calls itself.
This technique is useful. It's powerful for certain problems."
```

😊 Less repetitive

**Frequency = 0.3, Presence = 0.1** (technical content):

```
"Recursion occurs when a function invokes itself.
This pattern is useful for tree traversal.
Recursive solutions are elegant but require base cases."
```

🤩 Clear, allows necessary term repetition

---

## 📊 Decision Matrix

| Goal                     | Frequency           | Presence           |
| ------------------------ | ------------------- | ------------------ |
| Reduce phrase repetition | **HIGH (0.6-1.0)**  | Medium (0.3-0.5)   |
| Explore diverse topics   | Medium (0.3-0.5)    | **HIGH (0.6-1.0)** |
| Creative writing         | High (0.7-1.0)      | High (0.6-0.9)     |
| Technical docs           | Low (0.2-0.4)       | Low (0.1-0.3)      |
| Chatbot                  | Medium (0.4-0.6)    | Medium (0.3-0.5)   |
| Poetry (with refrain)    | **NEGATIVE (-0.3)** | Medium (0.4-0.6)   |
| Consistent terminology   | Low (0.0-0.2)       | Low (0.0-0.1)      |

---

## 🚦 Traffic Light Guide

### 🔴 High Penalty (0.7-2.0)

**Frequency**: Force completely new phrasing
**Presence**: Force exploring completely new topics

**When to use**:

- Creative writing
- Brainstorming
- Avoiding loops

**Warning**: May produce unnatural text if too high!

---

### 🟡 Medium Penalty (0.3-0.7)

**Frequency**: Reduce repetition, allow natural reuse
**Presence**: Encourage variety, stay on topic

**When to use**:

- General chatbots
- Blog posts
- Product descriptions

**Sweet spot for most use cases!**

---

### 🟢 Low/Zero Penalty (0.0-0.3)

**Frequency**: Allow natural repetition
**Presence**: Focus on main topic

**When to use**:

- Technical documentation
- Code generation
- Consistent outputs
- Domain-specific terminology

---

### ⚫ Negative Penalty (-2.0 to -0.1)

**Frequency**: ENCOURAGE repetition
**Presence**: ENCOURAGE reusing words

**When to use**:

- Poetry with refrains
- Mantras
- Stylistic repetition
- (Rarely used!)

---

## 💡 Pro Tips

### Tip 1: Start Low, Go Higher

```
Try: 0.0 → 0.3 → 0.5 → 0.7
Don't jump straight to 1.5!
```

### Tip 2: Frequency for Phrases, Presence for Topics

```
Reduce "very very very" → Frequency
Explore beyond "cats" → Presence
```

### Tip 3: Combine with Temperature

```
High temp + High penalties = Maximum diversity
Low temp + Low penalties = Maximum consistency
```

### Tip 4: Use Seed for Testing

```
{
  seed: 42,
  frequency_penalty: 0.5  // Test this
}

{
  seed: 42,
  frequency_penalty: 0.8  // Then compare
}
```

### Tip 5: Monitor Metrics

```
High repetitionRatio → Increase frequency_penalty
Low vocabularyRichness → Increase presence_penalty
```

---

## 🎯 Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│  FREQUENCY PENALTY: How Many Times?             │
│  ───────────────────────────────────             │
│  Formula: penalty × (count / total)             │
│  Effect:  Escalating (linear)                   │
│  Range:   -2.0 to 2.0                           │
│  Default: 0.0                                   │
│  Common:  0.3 - 0.7                             │
│                                                 │
│  Use for: Reducing repetitive phrasing         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  PRESENCE PENALTY: Appeared At All?             │
│  ────────────────────────────────               │
│  Formula: penalty × (1 if exists else 0)        │
│  Effect:  Fixed (binary)                        │
│  Range:   -2.0 to 2.0                           │
│  Default: 0.0                                   │
│  Common:  0.3 - 0.7                             │
│                                                 │
│  Use for: Encouraging topic diversity           │
└─────────────────────────────────────────────────┘
```

---

## 🎓 Final Mental Model

Think of it like a **word budget**:

### Frequency Penalty

"Every time you use a word, it gets MORE expensive"

- First "the": $1
- Second "the": $2
- Third "the": $3

### Presence Penalty

"Once you use a word, it costs extra forever"

- First "the": $1
- Second "the": still $1
- Third "the": still $1

### No Penalties

"All words are always free!"

- Any word, any time: $0

---

**Remember**: Both penalties work together! They're not mutually exclusive.

**Common mistake**: Setting both too high (>1.0) → Unnatural, forced diversity

**Best practice**: Start moderate (0.3-0.5), adjust based on output quality

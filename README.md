# AI Response Quality Analyzer

A powerful web application for analyzing and comparing LLM responses with different parameters. Built as part of GenAI Labs to help developers and researchers optimize their AI prompts and understand the impact of different parameter configurations.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

- **Parameter Experimentation**: Test multiple temperature and top_p combinations simultaneously
- **Quality Metrics**: Automated evaluation using three key metrics:
  - **Coherence**: Measures text flow and word diversity
  - **Length Appropriateness**: Evaluates response length (50-400 words ideal)
  - **Completeness**: Tracks keyword coverage from the original prompt
- **Visual Analysis**: Compare results with tables, charts, and side-by-side views
- **Data Persistence**: Save experiments to browser storage or export as JSON/CSV
- **Modern UI**: Built with ShadCN/UI components and smooth animations

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Components**: ShadCN/UI + Tailwind CSS
- **State Management**: React Hooks + TanStack Query
- **Form Handling**: react-hook-form + zod validation
- **Charts**: Recharts
- **Animations**: Framer Motion
- **AI Integration**: OpenAI API (GPT-3.5-turbo)

### Project Structure

```
genAiLabs/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint for LLM generation
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main application page
├── components/
│   ├── ui/                       # ShadCN UI components
│   ├── prompt-form.tsx           # Input form with parameter controls
│   ├── results-table.tsx         # Tabular results view
│   ├── metrics-chart.tsx         # Bar chart visualization
│   ├── response-comparison.tsx   # Side-by-side response view
│   ├── results-dashboard.tsx     # Tabbed dashboard container
│   ├── export-actions.tsx        # Export and save functionality
│   └── providers.tsx             # TanStack Query provider
├── lib/
│   ├── openai.ts                 # OpenAI client wrapper
│   ├── metrics.ts                # Quality metrics calculation
│   ├── export.ts                 # JSON/CSV export utilities
│   ├── storage.ts                # localStorage persistence
│   ├── validation.ts             # Zod schemas
│   └── utils.ts                  # Helper utilities
└── types/
    └── index.ts                  # TypeScript type definitions
```

## 📊 Metrics Explained

### 1. Coherence Score (0-1)

Evaluates the quality of text flow and structure:

- **Word Diversity**: Penalizes excessive repetition by calculating unique words ratio
- **Sentence Balance**: Rewards balanced sentence lengths (ideal: ~15 words/sentence)
- **Formula**: `(uniqueWords/totalWords * 0.6) + (sentenceBalance * 0.4)`

### 2. Length Score (0-1)

Assesses response length appropriateness:

- **Ideal Range**: 50-400 words
- **Scoring**:
  - Too short (< 50): Linear penalty proportional to shortfall
  - Ideal (50-400): Maximum score of 1.0
  - Too long (> 400): Decreasing score based on excess length

### 3. Completeness Score (0-1)

Measures how well the response addresses the prompt:

- **Keyword Extraction**: Identifies meaningful terms from prompt (filters common words)
- **Coverage Analysis**: Counts how many prompt keywords appear in response
- **Formula**: `matchedKeywords / totalPromptKeywords`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/genAiLabs.git
cd genAiLabs
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Step 1: Configure Your Experiment

1. **Enter a Prompt**: Type the prompt you want to test (minimum 10 characters)
2. **Set Temperature Range**:
   - Min-Max range (0-1)
   - Lower = more focused, Higher = more creative
3. **Set Top P Range**:
   - Min-Max range (0-1)
   - Controls nucleus sampling
4. **Select Number of Responses**: Choose 1-5 responses to generate

### Step 2: Generate Responses

Click "Generate Responses" to send requests to OpenAI. The system will:

- Create parameter combinations across your specified ranges
- Call the API for each combination
- Calculate quality metrics for each response
- Display results in real-time

### Step 3: Analyze Results

Switch between three views:

- **Overview**: Tabular data with highlighted best metrics
- **Metrics Chart**: Visual comparison using bar charts
- **Responses**: Full text of each response with metrics

### Step 4: Export or Save

- **Export JSON**: Download raw data for programmatic analysis
- **Export CSV**: Download spreadsheet-compatible format
- **Save to Browser**: Persist results in localStorage
- **Load from Browser**: Restore previously saved experiments

## 🔧 Configuration

### Customizing Metrics

Edit `/lib/metrics.ts` to adjust metric calculations:

```typescript
// Example: Change ideal word range
const minIdeal = 50; // Your minimum
const maxIdeal = 400; // Your maximum
```

### API Configuration

Modify `/lib/openai.ts` to change:

- Model selection
- Max tokens
- Other OpenAI parameters

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [ShadCN/UI](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for GenAI Labs**

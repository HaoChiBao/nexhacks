# Polymarket Portfolio Autopilot Backend

A backend system that powers "ETF-like portfolios" for Polymarket using LangGraph and Python.

## Features
- **Orchestrated Workflow**: Uses LangGraph to manage Research and Allocation agents.
- **Portfolios**: Define thematic funds (e.g., "AI Policy", "Crypto") or create **Dynamic Topics** on the fly.
- **Tools**: Fetches live data from Polymarket Gamma API (with intelligent agentic search fallback) and performs regulatory/news research.
- **Output**: Generates a clean, actionable summary with recommended trades and clickable market links.

## Structure
- `app/api`: FastAPI routes.
- `app/graphs`: LangGraph workflow definitions.
- `app/agents`: Logic nodes (Orchestrator, Research, Allocator).
- `app/tools`: Integrations (Polymarket, Search, Risk Math).

## Setup
1. Install dependencies:
   ```bash
   cd server
   pip install -e .
   ```
2. Set up environment:
   ```bash
   cp .env.example .env
   # Edit .env with your keys (OPENAI_API_KEY, TAVILY_API_KEY)
   ```

## Usage

### 1. Run Server
Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```
API Documentation will be available at: http://localhost:8000/docs

### 2. API Endpoints

#### POST `/rebalance/`
Run a rebalance workflow.

**Option A: Predefined Portfolio**
```json
{
  "portfolio_id": "ai_policy",
  "bankroll": 100.0
}
```

**Option B: Dynamic Topic** (Research anything!)
```json
{
  "topic": "LeBron James",
  "bankroll": 100.0
}
```

### 3. CLI Usage
Run the workflow directly from the terminal:

**Predefined:**
```bash
python -m app.cli.run_rebalance --portfolio ai_policy --bankroll 100
```

**Dynamic Topic:**
```bash
python -m app.cli.run_rebalance --topic "LeBron James"
```

# 📡 API Documentation

## Base URL
Local:  http://localhost:5000
Live:   https://your-render-url.onrender.com

## Endpoints

### POST /api/analyze

Analyzes a business decision using 4 AI agents.

**Request Body:**
```json
{
  "decision": "Should I quit my job and start a SaaS company?"
}
```

**Success Response (200):**
```json
{
  "agents": [
    {
      "id": "risk",
      "name": "Risk Analyst",
      "emoji": "🔴",
      "color": "#ef4444",
      "content": "• Financial risk: ...\n• Market risk: ..."
    },
    {
      "id": "growth",
      "name": "Growth Hacker",
      "emoji": "🟢",
      "color": "#22c55e",
      "content": "• Opportunity: ...\n• Growth lever: ..."
    },
    {
      "id": "financial",
      "name": "Financial Hawk",
      "emoji": "🔵",
      "color": "#3b82f6",
      "content": "• Cost structure: ...\n• ROI estimate: ..."
    },
    {
      "id": "devil",
      "name": "Devil's Advocate",
      "emoji": "🟡",
      "color": "#f59e0b",
      "content": "• Assumption challenged: ...\n• Counter-argument: ..."
    }
  ],
  "consensus": "1. Overall Assessment: ...\n2. Top 3 Things To Do: ...\n3. Top 3 Things To Avoid: ...\n4. Final Verdict: GO"
}
```

**Error Response (400):**
```json
{
  "error": "Decision is required"
}
```

**Error Response (500):**
```json
{
  "error": "Something went wrong. Check your API key."
}
```

## Notes

- Average response time: 10–15 seconds
- Max tokens per agent: 500
- Max tokens for consensus: 600
- Model used: llama-3.3-70b-versatile
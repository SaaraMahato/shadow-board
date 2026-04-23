# 🏗️ System Architecture

## Overview

Shadow Board is a full-stack web application that uses multiple AI agents
to analyze business decisions from different perspectives simultaneously.

## Architecture Diagram
User (Browser)
│
▼
React Frontend (port 3000)
│  POST /api/analyze { decision }
▼
Node.js + Express Backend (port 5000)
│
├── Agent 1: Risk Analyst    ──┐
├── Agent 2: Growth Hacker   ──┤ → Groq API (LLaMA 3.3)
├── Agent 3: Financial Hawk  ──┤    (runs in parallel)
└── Agent 4: Devil's Advocate──┘
│
▼
Agent 5: Consensus
│
▼
JSON Response to Frontend
│
▼
4 Agent Cards + Consensus Card

## How It Works

1. User types a decision in the input box
2. React sends a POST request to the backend
3. Backend calls Groq API 4 times in parallel (Promise.all)
4. Each call uses a different system prompt (agent persona)
5. All 4 responses are collected
6. A 5th API call synthesizes them into a consensus
7. All results are returned to the frontend as JSON
8. React renders each agent response in its own card

## Key Design Decisions

- **Parallel API calls** using Promise.all for speed
- **Groq API** chosen for free tier and fast inference
- **LLaMA 3.3 70B** model for high quality responses
- **No database** needed — stateless architecture
- **CSS classes** for styling — no Tailwind dependency
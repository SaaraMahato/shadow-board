# ⚙️ Setup Guide

## Prerequisites

Make sure you have these installed:
- Node.js (v18 or above) — download from nodejs.org
- npm (comes with Node.js)
- A free Groq API key — from console.groq.com

## Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/shadow-board.git
cd shadow-board
```

## Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Open `.env` and add your Groq API key:
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000

Start the backend:
```bash
npm run dev
```

You should see:
🚀 Server running on http://localhost:5000

## Step 3 — Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm start
```

You should see the app open at:
http://localhost:3000

## Step 4 — Test the App

1. Type a business decision in the input box
2. Press Analyze
3. Wait 10–15 seconds
4. See all 4 agent responses + consensus

## Common Errors

| Error | Fix |
|---|---|
| `Invalid API Key` | Check your .env file has the correct Groq key |
| `Cannot connect to backend` | Make sure backend is running on port 5000 |
| `Module not found` | Run npm install again in that folder |
| `Port already in use` | Kill the process using that port and restart |

## Deployment

- **Frontend:** Push to Vercel — connect GitHub repo, auto-deploys
- **Backend:** Push to Render — add GROQ_API_KEY in environment variables
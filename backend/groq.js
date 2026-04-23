import Groq from "groq-sdk";
import dotenv from "dotenv";
import agents from "./agents.js";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const call = async (systemPrompt, userPrompt) => {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt },
    ],
    max_tokens: 400,
  });
  return res.choices[0].message.content;
};

// Step 1 — Initial responses from all 4 agents
export async function getInitialResponses(decision, decisionType) {
  const results = await Promise.all(
    agents.map(async (agent) => {
      const content = await call(
        agent.persona(decisionType),
        `Analyze this ${decisionType} decision: "${decision}". Give structured advice in your role.`
      );
      return { id: agent.id, name: agent.name, emoji: agent.emoji, color: agent.color, content };
    })
  );
  return results;
}

// Step 2 — Each agent critiques another agent's response
export async function getCritiques(decision, initialResponses, decisionType) {
  const results = await Promise.all(
    agents.map(async (agent) => {
      const targetResponse = initialResponses.find((r) => r.id === agent.critiqueTarget);
      const targetAgent    = agents.find((a) => a.id === agent.critiqueTarget);

      const content = await call(
        agent.critiquePersona(decisionType),
        `Decision: "${decision}"
        
${targetAgent.name} said:
"${targetResponse.content}"

Now critique this response from your perspective. Be specific and reference their exact points.`
      );

      return {
        id: `${agent.id}_critique`,
        reviewerId: agent.id,
        reviewerName: agent.name,
        reviewerEmoji: agent.emoji,
        reviewerColor: agent.color,
        targetId: agent.critiqueTarget,
        targetName: targetAgent.name,
        content,
      };
    })
  );
  return results;
}

// Step 3 — Each agent refines their response based on critiques received
export async function getRefinedResponses(decision, initialResponses, critiques, decisionType) {
  const results = await Promise.all(
    agents.map(async (agent) => {
      const original  = initialResponses.find((r) => r.id === agent.id);
      const critiqueReceived = critiques.find((c) => c.targetId === agent.id);

      const content = await call(
        agent.persona(decisionType),
        `Decision: "${decision}"

Your original response was:
"${original.content}"

You received this critique from ${critiqueReceived.reviewerName}:
"${critiqueReceived.content}"

Now refine your response. Acknowledge valid points from the critique, defend where you disagree, and give a stronger final analysis. Use bullet points.`
      );

      return { id: agent.id, name: agent.name, emoji: agent.emoji, color: agent.color, content };
    })
  );
  return results;
}

// Step 4 — Scored consensus
export async function getScoredConsensus(decision, refinedResponses, decisionType) {
  const combined = refinedResponses
    .map((r) => `${r.name}:\n${r.content}`)
    .join("\n\n---\n\n");

  const content = await call(
    `You are a senior advisor synthesizing expert opinions for a ${decisionType} decision.
    Analyze the responses and provide a scored consensus. Structure EXACTLY as:

    MAJORITY INSIGHTS (points most agents agree on):
    • [insight 1]
    • [insight 2]
    • [insight 3]

    CONFLICTING POINTS (where agents disagree):
    • [conflict 1]
    • [conflict 2]

    CONFIDENCE SCORES:
    • Risk Analyst: [X]/10
    • Growth Hacker: [X]/10
    • Financial Hawk: [X]/10
    • Devil's Advocate: [X]/10

    FINAL RECOMMENDATION:
    [2-3 sentence recommendation]

    VERDICT: GO / NO-GO / MODIFY`,

    `Decision: "${decision}"\n\nRefined expert responses:\n${combined}`
  );

  return content;
}

export { agents };
import express from "express";
import {
  getInitialResponses,
  getCritiques,
  getRefinedResponses,
  getScoredConsensus,
} from "../groq.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { decision, decisionType = "startup" } = req.body;

  if (!decision || decision.trim() === "") {
    return res.status(400).json({ error: "Decision is required" });
  }

  try {
    // Step 1 — Initial responses
    const initialResponses = await getInitialResponses(decision, decisionType);

    // Step 2 — Critiques
    const critiques = await getCritiques(decision, initialResponses, decisionType);

    // Step 3 — Refined responses
    const refinedResponses = await getRefinedResponses(decision, initialResponses, critiques, decisionType);

    // Step 4 — Scored consensus
    const consensus = await getScoredConsensus(decision, refinedResponses, decisionType);

    res.json({
      initialResponses,
      critiques,
      agents: refinedResponses,
      consensus,
    });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Something went wrong. Check your API key." });
  }
});

export default router;
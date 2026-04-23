import express from "express";
import Decision from "../models/Decision.js";
import {
  getInitialResponses,
  getCritiques,
  getRefinedResponses,
  getScoredConsensus,
} from "../groq.js";

const router = express.Router();

// POST /api/analyze - Create a new decision analysis
router.post("/", async (req, res) => {
  const { decision, decisionType = "startup", userId } = req.body;

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

    // Save to database
    const newDecision = new Decision({
      title: decision.substring(0, 100),
      description: decision,
      decisionType,
      userId,
      initialResponses,
      critiques,
      refinedResponses,
      consensus,
      status: "completed",
    });

    const savedDecision = await newDecision.save();

    res.json({
      _id: savedDecision._id,
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

// GET /api/analyze/:id - Get a specific decision
router.get("/:id", async (req, res) => {
  try {
    const decision = await Decision.findById(req.params.id);
    if (!decision) {
      return res.status(404).json({ error: "Decision not found" });
    }
    res.json(decision);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error retrieving decision" });
  }
});

// GET /api/analyze/user/:userId - Get all decisions for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const decisions = await Decision.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(decisions);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error retrieving decisions" });
  }
});

// DELETE /api/analyze/:id - Delete a decision
router.delete("/:id", async (req, res) => {
  try {
    const decision = await Decision.findByIdAndDelete(req.params.id);
    if (!decision) {
      return res.status(404).json({ error: "Decision not found" });
    }
    res.json({ message: "Decision deleted successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error deleting decision" });
  }
});

export default router;
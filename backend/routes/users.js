import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST /api/users - Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, role = "user" } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json(existingUser);
    }

    const newUser = new User({ name, email, role });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error creating user" });
  }
});

// GET /api/users/:id - Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("decisions");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error retrieving user" });
  }
});

// GET /api/users/email/:email - Get a user by email
router.get("/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate("decisions");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error retrieving user" });
  }
});

export default router;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./routes/analyze.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow all origins
app.use(cors());
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => res.send("Shadow Board API running ✅"));
app.use("/api/analyze", analyzeRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import analyzeRoute from "./routes/analyze.js";
import usersRoute from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Shadow Board API running ✅"));

app.use("/api/analyze", analyzeRoute);
app.use("/api/users", usersRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
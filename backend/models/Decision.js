import mongoose from "mongoose";

const decisionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  decisionType: {
    type: String,
    enum: ["startup", "financial", "career", "product", "marketing"],
    default: "startup",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  initialResponses: [{
    id: String,
    name: String,
    emoji: String,
    color: String,
    content: String,
  }],
  critiques: [mongoose.Schema.Types.Mixed],
  refinedResponses: [mongoose.Schema.Types.Mixed],
  consensus: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "archived"],
    default: "completed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Decision", decisionSchema);

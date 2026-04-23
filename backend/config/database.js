import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/shadow-board";
    
    await mongoose.connect(mongoURI);
    
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;

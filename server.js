/**
 * CampusConnect AI - Server
 * Author: SPA
 */

import dns from "dns";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (e) {
  // ignore
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import universityRoutes from "./routes/universityRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "CampusConnect AI",
    author: "SPA",
    features: [
      "AI-Assisted Smart Campus Assistant",
      "Student Grievance & Complaint Management System",
      "University Details Knowledge Base",
      "MERN & Flutter/Dart Ready REST APIs"
    ],
    dbState: mongoose.connection.readyState === 1 ? "connected" : "in-memory-fallback"
  });
});

// App Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/complaints", complaintRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusconnect";

// Connect DB asynchronously without blocking server startup
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.warn("⚠️ MongoDB Connection:", err.message);
    console.warn("ℹ️ Running with fallback memory store. Update MONGO_URI in server/.env to use MongoDB.");
  });

const server = app.listen(PORT, () => {
  console.log(`🚀 CampusConnect-AI Server Running on port ${PORT}`);
  console.log(`👩‍💻 Author: SPA`);
});

export default server;


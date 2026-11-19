/**
 * CampusConnect AI - Complaint Model
 * Author: SPA
 */

import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentRoll: {
    type: String,
    default: "STU-2026"
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Hostel", "Academics", "Infrastructure", "Canteen", "Library", "Harassment/Ragging", "Laboratory", "Other"],
    default: "Infrastructure"
  },
  complaintLevel: {
    type: String,
    enum: ["Level 1 - Minor", "Level 2 - Moderate", "Level 3 - High", "Level 4 - Urgent / Emergency"],
    default: "Level 2 - Moderate"
  },
  incidentDate: {
    type: String,
    default: () => new Date().toISOString().split("T")[0]
  },
  incidentTime: {
    type: String,
    default: "10:00 AM"
  },
  location: {
    type: String,
    default: "Campus Main Block"
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Under Review", "In Progress", "Resolved", "Rejected"],
    default: "Pending"
  },
  adminFeedback: {
    type: String,
    default: ""
  },
  actionTaken: {
    type: String,
    default: ""
  },
  evaluatedBy: {
    type: String,
    default: ""
  },
  evaluatedAt: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);

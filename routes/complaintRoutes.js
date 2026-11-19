/**
 * CampusConnect AI - Student Complaint System Routes
 * Author: SPA
 */

import express from "express";
import Complaint from "../models/Complaint.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { isDbConnected, memoryComplaints } from "../memoryStore.js";

const router = express.Router();

// 1. Student raises a new complaint (with Category, Date, Time, Complaint Level, Location)
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      category,
      complaintLevel,
      incidentDate,
      incidentTime,
      location,
      description
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Complaint title and description are required." });
    }

    const studentId = req.user.id;
    const studentName = req.user.name || "Student";
    const studentEmail = req.user.email || "student@campus.edu";
    const studentRoll = req.user.rollNumber || "STU-" + Math.floor(1000 + Math.random() * 9000);

    const newRecord = {
      studentId,
      studentName,
      studentEmail,
      studentRoll,
      title,
      category: category || "Infrastructure",
      complaintLevel: complaintLevel || "Level 2 - Moderate",
      incidentDate: incidentDate || new Date().toISOString().split("T")[0],
      incidentTime: incidentTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: location || "Campus Main Block",
      description,
      status: "Pending",
      adminFeedback: "",
      actionTaken: "",
      evaluatedBy: "",
      evaluatedAt: ""
    };

    if (isDbConnected()) {
      const complaint = await Complaint.create(newRecord);
      return res.json(complaint);
    } else {
      const complaint = {
        _id: "c_" + Date.now(),
        ...newRecord,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryComplaints.unshift(complaint);
      return res.json(complaint);
    }
  } catch (err) {
    console.error("Create Complaint Error:", err.message);
    res.status(500).json({ message: "Failed to submit grievance" });
  }
});

// 2. Student views their own complaints (with admin feedback and status)
router.get("/my", protect, async (req, res) => {
  try {
    const studentId = req.user.id;
    const studentEmail = req.user.email;

    if (isDbConnected()) {
      const list = await Complaint.find({
        $or: [
          { studentId },
          { studentEmail }
        ]
      }).sort({ createdAt: -1 });
      return res.json(list);
    } else {
      const list = memoryComplaints
        .filter(c => c.studentId === studentId || c.studentEmail === studentEmail)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(list);
    }
  } catch (err) {
    console.error("Fetch Student Complaints Error:", err.message);
    res.status(500).json({ message: "Failed to fetch your complaints" });
  }
});

// 3. Admin views all complaints
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      const list = await Complaint.find().sort({ createdAt: -1 });
      return res.json(list);
    } else {
      return res.json(memoryComplaints);
    }
  } catch (err) {
    console.error("Fetch All Complaints Error:", err.message);
    res.status(500).json({ message: "Failed to fetch complaints list" });
  }
});

// 4. Admin evaluates complaint and returns feedback to student
router.put("/:id/evaluate", protect, adminOnly, async (req, res) => {
  try {
    const { status, adminFeedback, actionTaken } = req.body;
    const actionBy = req.user.name || "SPA Admin";
    const evaluatedAt = new Date().toLocaleString();

    if (isDbConnected()) {
      const complaint = await Complaint.findById(req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      if (status) complaint.status = status;
      if (adminFeedback !== undefined) complaint.adminFeedback = adminFeedback;
      if (actionTaken !== undefined) complaint.actionTaken = actionTaken;
      complaint.evaluatedBy = actionBy;
      complaint.evaluatedAt = evaluatedAt;

      await complaint.save();
      return res.json(complaint);
    } else {
      const complaint = memoryComplaints.find(c => c._id === req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      if (status) complaint.status = status;
      if (adminFeedback !== undefined) complaint.adminFeedback = adminFeedback;
      if (actionTaken !== undefined) complaint.actionTaken = actionTaken;
      complaint.evaluatedBy = actionBy;
      complaint.evaluatedAt = evaluatedAt;
      complaint.updatedAt = new Date().toISOString();

      return res.json(complaint);
    }
  } catch (err) {
    console.error("Evaluate Complaint Error:", err.message);
    res.status(500).json({ message: "Failed to evaluate complaint" });
  }
});

// 5. Delete complaint
router.delete("/:id", protect, async (req, res) => {
  try {
    if (isDbConnected()) {
      await Complaint.findByIdAndDelete(req.params.id);
    } else {
      const idx = memoryComplaints.findIndex(c => c._id === req.params.id);
      if (idx !== -1) memoryComplaints.splice(idx, 1);
    }
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete complaint" });
  }
});

export default router;

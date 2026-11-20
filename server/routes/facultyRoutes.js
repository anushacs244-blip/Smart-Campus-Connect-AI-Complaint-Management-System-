/**
 * CampusConnect AI - Faculty Routes
 * Author: SPA
 */

import express from "express";
import Faculty from "../models/Faculty.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { isDbConnected, memoryFaculty, memoryCache } from "../memoryStore.js";

const router = express.Router();

// UPDATE faculty
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      const updated = await Faculty.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Faculty not found" });
      return res.json(updated);
    } else {
      const idx = memoryFaculty.findIndex(f => f._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: "Faculty not found" });
      memoryFaculty[idx] = { ...memoryFaculty[idx], ...req.body };
      return res.json(memoryFaculty[idx]);
    }
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// GET all faculty
router.get("/", async (req, res) => {
  try {
    if (isDbConnected()) {
      const data = await Faculty.find().sort({ _id: -1 });
      return res.json(data);
    } else {
      return res.json(memoryFaculty);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch faculty" });
  }
});

// ADD faculty
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    if (memoryCache && memoryCache.clear) memoryCache.clear();

    if (isDbConnected()) {
      const faculty = await Faculty.create({
        name: req.body.name,
        department: req.body.department,
        designation: req.body.designation,
        email: req.body.email
      });
      return res.json(faculty);
    } else {
      const newFaculty = {
        _id: "f_" + Date.now(),
        name: req.body.name,
        department: req.body.department,
        designation: req.body.designation,
        email: req.body.email,
        createdAt: new Date().toISOString()
      };
      memoryFaculty.unshift(newFaculty);
      return res.json(newFaculty);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to add faculty" });
  }
});

// DELETE faculty
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      await Faculty.findByIdAndDelete(req.params.id);
    } else {
      const idx = memoryFaculty.findIndex(f => f._id === req.params.id);
      if (idx !== -1) memoryFaculty.splice(idx, 1);
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete faculty" });
  }
});

export default router;

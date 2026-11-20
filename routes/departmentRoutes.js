/**
 * CampusConnect AI - Department Routes
 * Author: SPA
 */

import express from "express";
import Department from "../models/Department.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { isDbConnected, memoryDepartments, memoryCache } from "../memoryStore.js";

const router = express.Router();

// UPDATE department
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      const updated = await Department.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ message: "Department not found" });
      return res.json(updated);
    } else {
      const idx = memoryDepartments.findIndex(d => d._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: "Department not found" });
      memoryDepartments[idx] = { ...memoryDepartments[idx], ...req.body };
      return res.json(memoryDepartments[idx]);
    }
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ message: "Update failed" });
  }
});

// GET all departments
router.get("/", async (req, res) => {
  try {
    if (isDbConnected()) {
      const data = await Department.find().sort({ _id: -1 });
      return res.json(data);
    } else {
      return res.json(memoryDepartments);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch departments" });
  }
});

// ADD department
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    if (memoryCache && memoryCache.clear) memoryCache.clear();

    if (isDbConnected()) {
      const dept = await Department.create(req.body);
      return res.json(dept);
    } else {
      const newDept = { _id: "d_" + Date.now(), ...req.body, createdAt: new Date().toISOString() };
      memoryDepartments.unshift(newDept);
      return res.json(newDept);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to add department" });
  }
});

// DELETE department
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      await Department.findByIdAndDelete(req.params.id);
    } else {
      const idx = memoryDepartments.findIndex(d => d._id === req.params.id);
      if (idx !== -1) memoryDepartments.splice(idx, 1);
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete department" });
  }
});

export default router;

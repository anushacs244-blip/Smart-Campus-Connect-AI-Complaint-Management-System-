/**
 * CampusConnect AI - Notice Routes
 * Author: SPA
 */

import express from "express";
import Notice from "../models/Notice.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { isDbConnected, memoryNotices, memoryCache } from "../memoryStore.js";

const router = express.Router();

// UPDATE notice
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      const updated = await Notice.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Notice not found" });
      return res.json(updated);
    } else {
      const idx = memoryNotices.findIndex(n => n._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: "Notice not found" });
      memoryNotices[idx] = { ...memoryNotices[idx], ...req.body };
      return res.json(memoryNotices[idx]);
    }
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// GET all notices (Most recent first)
router.get("/", async (req, res) => {
  try {
    if (isDbConnected()) {
      const data = await Notice.find().sort({ createdAt: -1, date: -1, _id: -1 });
      return res.json(data);
    } else {
      return res.json(memoryNotices);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notices" });
  }
});

// ADD notice (Inserts to front so it is immediately the most recent)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    // Clear any cached AI answers so the new notice reflects immediately
    if (memoryCache && memoryCache.clear) memoryCache.clear();

    if (isDbConnected()) {
      const notice = await Notice.create({
        title: req.body.title,
        details: req.body.details,
        issuedBy: req.body.issuedBy,
        date: req.body.date || new Date().toISOString().split("T")[0]
      });
      return res.json(notice);
    } else {
      const newNotice = {
        _id: "n_" + Date.now(),
        title: req.body.title,
        details: req.body.details,
        issuedBy: req.body.issuedBy || "Administration",
        date: req.body.date || new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString()
      };
      // unshift puts it at the beginning as the newest record
      memoryNotices.unshift(newNotice);
      return res.json(newNotice);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to add notice" });
  }
});

// DELETE notice
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      await Notice.findByIdAndDelete(req.params.id);
    } else {
      const idx = memoryNotices.findIndex(n => n._id === req.params.id);
      if (idx !== -1) memoryNotices.splice(idx, 1);
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notice" });
  }
});

export default router;

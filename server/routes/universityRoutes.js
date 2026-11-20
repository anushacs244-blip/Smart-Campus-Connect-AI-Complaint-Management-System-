/**
 * CampusConnect AI - University Details Routes
 * Author: SPA
 */

import express from "express";
import University from "../models/University.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { isDbConnected, memoryUniversity, memoryCache } from "../memoryStore.js";

const router = express.Router();

// GET university details
router.get("/", async (req, res) => {
  try {
    if (isDbConnected()) {
      let data = await University.findOne();
      if (!data) {
        data = await University.create(memoryUniversity);
      }
      return res.json(data);
    } else {
      return res.json(memoryUniversity);
    }
  } catch (err) {
    console.error("Fetch University Error:", err.message);
    res.status(500).json({ message: "Failed to fetch university details" });
  }
});

// UPDATE or CREATE university details (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    if (memoryCache && memoryCache.clear) memoryCache.clear();

    if (isDbConnected()) {
      let univ = await University.findOne();
      if (univ) {
        Object.assign(univ, req.body);
        await univ.save();
      } else {
        univ = await University.create(req.body);
      }
      return res.json(univ);
    } else {
      Object.assign(memoryUniversity, req.body);
      return res.json(memoryUniversity);
    }
  } catch (err) {
    console.error("Save University Error:", err.message);
    res.status(500).json({ message: "Failed to save university details" });
  }
});

export default router;

/**
 * CampusConnect AI - Facility Routes
 * Author: SPA
 */

import express from "express";
import Facility from "../models/Facility.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { isDbConnected, memoryFacilities, memoryCache } from "../memoryStore.js";

const router = express.Router();

// UPDATE facility
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      const updated = await Facility.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Facility not found" });
      return res.json(updated);
    } else {
      const idx = memoryFacilities.findIndex(f => f._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: "Facility not found" });
      memoryFacilities[idx] = { ...memoryFacilities[idx], ...req.body };
      return res.json(memoryFacilities[idx]);
    }
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// GET all facilities
router.get("/", async (req, res) => {
  try {
    if (isDbConnected()) {
      const data = await Facility.find().sort({ _id: -1 });
      return res.json(data);
    } else {
      return res.json(memoryFacilities);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch facilities" });
  }
});

// ADD facility
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    if (memoryCache && memoryCache.clear) memoryCache.clear();

    if (isDbConnected()) {
      const facility = await Facility.create({
        name: req.body.name,
        location: req.body.location,
        timings: req.body.timings
      });
      return res.json(facility);
    } else {
      const newFacility = {
        _id: "fc_" + Date.now(),
        name: req.body.name,
        location: req.body.location,
        timings: req.body.timings,
        createdAt: new Date().toISOString()
      };
      memoryFacilities.unshift(newFacility);
      return res.json(newFacility);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to add facility" });
  }
});

// DELETE facility
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      await Facility.findByIdAndDelete(req.params.id);
    } else {
      const idx = memoryFacilities.findIndex(f => f._id === req.params.id);
      if (idx !== -1) memoryFacilities.splice(idx, 1);
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete facility" });
  }
});

export default router;

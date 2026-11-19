/**
 * CampusConnect AI - Event Routes
 * Author: SPA
 */

import express from "express";
import Event from "../models/Event.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { isDbConnected, memoryEvents, memoryCache } from "../memoryStore.js";

const router = express.Router();

// UPDATE event
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      const updated = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Event not found" });
      return res.json(updated);
    } else {
      const idx = memoryEvents.findIndex(e => e._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: "Event not found" });
      memoryEvents[idx] = { ...memoryEvents[idx], ...req.body };
      return res.json(memoryEvents[idx]);
    }
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// GET all events (Most recent first)
router.get("/", async (req, res) => {
  try {
    if (isDbConnected()) {
      const data = await Event.find().sort({ createdAt: -1, eventDate: -1, _id: -1 });
      return res.json(data);
    } else {
      return res.json(memoryEvents);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// ADD event (Inserts to front so it is immediately the most recent)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    if (memoryCache && memoryCache.clear) memoryCache.clear();

    if (isDbConnected()) {
      const event = await Event.create({
        title: req.body.title,
        venue: req.body.venue,
        eventDate: req.body.eventDate
      });
      return res.json(event);
    } else {
      const newEvent = {
        _id: "e_" + Date.now(),
        title: req.body.title,
        venue: req.body.venue,
        eventDate: req.body.eventDate,
        createdAt: new Date().toISOString()
      };
      memoryEvents.unshift(newEvent);
      return res.json(newEvent);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to add event" });
  }
});

// DELETE event
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (isDbConnected()) {
      await Event.findByIdAndDelete(req.params.id);
    } else {
      const idx = memoryEvents.findIndex(e => e._id === req.params.id);
      if (idx !== -1) memoryEvents.splice(idx, 1);
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event" });
  }
});

export default router;

/**
 * CampusConnect AI - Auth Routes
 * Author: SPA
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/User.js";
import { isDbConnected, memoryUsers } from "../memoryStore.js";

const router = express.Router();

// 1. Student Registration Endpoint
router.post("/register/student", async (req, res) => {
  try {
    const { name, email, password, rollNumber, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (isDbConnected()) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Student account with this email already exists." });
      }

      const hash = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hash,
        role: "user",
        rollNumber: rollNumber || "STU-" + Math.floor(1000 + Math.random() * 9000),
        department: department || "Computer Engineering"
      });
    } else {
      const existing = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: "Student account with this email already exists." });
      }

      const hash = await bcrypt.hash(password, 10);
      memoryUsers.push({
        _id: "u_stu_" + Date.now(),
        name,
        email,
        password: hash,
        role: "user",
        rollNumber: rollNumber || "STU-" + Math.floor(1000 + Math.random() * 9000),
        department: department || "Computer Engineering"
      });
    }

    res.json({ message: "Student registered successfully! Please login." });
  } catch (err) {
    console.error("Student Register Error:", err);
    res.status(500).json({ message: "Server error during student registration" });
  }
});

// 2. Admin Registration Endpoint (requires admin security passkey)
router.post("/register/admin", async (req, res) => {
  try {
    const { name, email, password, adminCode, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // Require admin passcode for security
    const ADMIN_SECRET = process.env.ADMIN_SECURITY_CODE || "ADMIN2026";
    if (adminCode !== ADMIN_SECRET) {
      return res.status(403).json({
        message: "Invalid Admin Security Passcode! Only authorized campus staff may register as Admin."
      });
    }

    if (isDbConnected()) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Admin account with this email already exists." });
      }

      const hash = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hash,
        role: "admin",
        adminCode,
        department: department || "Campus Administration"
      });
    } else {
      const existing = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: "Admin account with this email already exists." });
      }

      const hash = await bcrypt.hash(password, 10);
      memoryUsers.push({
        _id: "u_adm_" + Date.now(),
        name,
        email,
        password: hash,
        role: "admin",
        adminCode,
        department: department || "Campus Administration"
      });
    }

    res.json({ message: "Administrator registered successfully! Please login." });
  } catch (err) {
    console.error("Admin Register Error:", err);
    res.status(500).json({ message: "Server error during admin registration" });
  }
});

// 3. General Registration (Legacy fallback)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const assignedRole = role === "admin" ? "admin" : "user";

    if (isDbConnected()) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "User with this email already exists." });
      }

      const hash = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hash,
        role: assignedRole,
        rollNumber: rollNumber || "",
        department: department || "Campus"
      });
    } else {
      const existing = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: "User with this email already exists." });
      }

      const hash = await bcrypt.hash(password, 10);
      memoryUsers.push({
        _id: "u_" + Date.now(),
        name,
        email,
        password: hash,
        role: assignedRole,
        rollNumber: rollNumber || "",
        department: department || "Campus"
      });
    }

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// 4. Login Endpoint (User / Student & Admin)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email });
    } else {
      user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(400).json({ message: "User not found. Please register." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber || "",
        department: user.department || ""
      },
      process.env.JWT_SECRET || "campusconnect_secret_key_by_spa_2026",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber || "",
      department: user.department || ""
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;

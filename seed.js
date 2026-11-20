/**
 * CampusConnect AI - Database Seeder
 * Author: SPA
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "./models/User.js";
import Department from "./models/Department.js";
import Faculty from "./models/Faculty.js";
import Event from "./models/Event.js";
import Facility from "./models/Facility.js";
import Notice from "./models/Notice.js";
import University from "./models/University.js";
import Complaint from "./models/Complaint.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusconnect";

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Connected to MongoDB");

    // Clean existing sample data
    await User.deleteMany({ email: { $in: ["spa@campusconnect.com", "spa@campusconnect.com", "student@campus.edu"] } });
    await Department.deleteMany({});
    await Faculty.deleteMany({});
    await Event.deleteMany({});
    await Facility.deleteMany({});
    await Notice.deleteMany({});
    await University.deleteMany({});
    await Complaint.deleteMany({});

    // Seed Admin & Demo Student
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "SPA Admin",
      email: "spa@campusconnect.com",
      password: hashedPassword,
      role: "admin"
    });
    // Alias for previous login
    await User.create({
      name: "SPA Admin",
      email: "spa@campusconnect.com",
      password: hashedPassword,
      role: "admin"
    });
    const student = await User.create({
      name: "Rahul Verma",
      email: "student@campus.edu",
      password: hashedPassword,
      role: "user"
    });
    console.log("✅ Admin user created: spa@campusconnect.com / admin123");
    console.log("✅ Demo Student created: student@campus.edu / admin123");

    // Seed University Details
    await University.create({
      name: "Smart Campus University",
      code: "SCU-2026",
      chancellor: "Dr. S. P. Acharya",
      viceChancellor: "Prof. A. R. Sharma",
      location: "Knowledge Park, Tech Campus, Building Central",
      establishedYear: "2008",
      accreditation: "NAAC A++ Grade, AICTE Approved, UGC Recognized",
      website: "https://smartcampus.edu",
      contactEmail: "info@smartcampus.edu",
      contactPhone: "+91 98765 43210",
      about: "Smart Campus University is a premier multidisciplinary institution empowering students with cutting-edge AI, modern engineering, and world-class campus facilities.",
      vision: "To foster innovative thinkers, AI-ready engineers, and leaders who impact society positively.",
      mission: "Deliver holistic education, encourage high-impact research, and provide transparent smart campus governance."
    });
    console.log("✅ University Details seeded");

    // Seed Departments
    await Department.insertMany([
      { name: "Computer Engineering", hod: "Dr. Anusha Rao", location: "Building A, 3rd Floor", contact: "hod_cs@campus.edu" },
      { name: "Information Technology", hod: "Prof. S. Kulkarni", location: "Building B, 2nd Floor", contact: "hod_it@campus.edu" },
      { name: "Electronics Engineering", hod: "Dr. M. Joshi", location: "Building C, 1st Floor", contact: "hod_extc@campus.edu" }
    ]);
    console.log("✅ Departments seeded");

    // Seed Faculty
    await Faculty.insertMany([
      { name: "Dr. Anusha Rao", department: "Computer Engineering", designation: "Professor & HOD", email: "anusha.rao@campus.edu" },
      { name: "Prof. Rajesh Kumar", department: "Computer Engineering", designation: "Assistant Professor", email: "rajesh.k@campus.edu" },
      { name: "Prof. Sneha Deshmukh", department: "Information Technology", designation: "Associate Professor", email: "sneha.d@campus.edu" },
      { name: "Prof. Amit Verma", department: "Electronics Engineering", designation: "Assistant Professor", email: "amit.v@campus.edu" }
    ]);
    console.log("✅ Faculty seeded");

    // Seed Events
    await Event.insertMany([
      { title: "Smart India Hackathon 2026", venue: "Auditorium", eventDate: "2026-12-15" },
      { title: "Annual Tech Fest - TechnoWave", venue: "Campus Ground", eventDate: "2026-11-28" },
      { title: "AI & Machine Learning Workshop", venue: "Seminar Hall 1", eventDate: "2026-11-22" }
    ]);
    console.log("✅ Events seeded");

    // Seed Facilities
    await Facility.insertMany([
      { name: "Central Library", location: "Academic Block 1, Ground Floor", timings: "8:00 AM - 8:00 PM" },
      { name: "AI & High-Performance Computing Lab", location: "Building A, Lab 304", timings: "9:00 AM - 6:00 PM" },
      { name: "Cafeteria & Food Court", location: "Campus Plaza", timings: "7:30 AM - 9:00 PM" },
      { name: "Sports Complex", location: "West Wing Ground", timings: "6:00 AM - 7:00 PM" }
    ]);
    console.log("✅ Facilities seeded");

    // Seed Notices
    await Notice.insertMany([
      { title: "Mid-Term Examination Schedule Released", details: "Examinations will commence from December 1st, 2026. Hall tickets available on portal.", issuedBy: "Examination Cell", date: "2026-11-15" },
      { title: "Campus Placement Registration Drive", details: "Registration open for final-year students. Verified by Placement Cell.", issuedBy: "Placement Cell", date: "2026-11-14" },
      { title: "Holiday Notice - University Day", details: "College will remain closed on Friday for University Foundation Day.", issuedBy: "Principal Office", date: "2026-11-10" }
    ]);
    console.log("✅ Notices seeded");

    // Seed Complaints
    await Complaint.insertMany([
      {
        studentId: student._id,
        studentName: "Rahul Verma",
        studentEmail: "student@campus.edu",
        title: "Wi-Fi Connectivity Issue in Hostel Block B",
        category: "Hostel",
        priority: "High",
        description: "The 3rd floor Wi-Fi router in Hostel B has frequent disconnections since yesterday evening.",
        status: "Under Review",
        adminRemarks: "IT network engineer assigned to inspect router on 3rd floor.",
        actionBy: "SPA Admin"
      },
      {
        studentId: student._id,
        studentName: "Rahul Verma",
        studentEmail: "student@campus.edu",
        title: "Projector Display flickering in Classroom 302",
        category: "Infrastructure",
        priority: "Medium",
        description: "During lectures, the projector HDMI port flickers and disconnects.",
        status: "Resolved",
        adminRemarks: "HDMI cable and connector replaced with new high-speed cable. Working fine now.",
        actionBy: "SPA Admin"
      }
    ]);
    console.log("✅ Complaints seeded");

    console.log("\n🎉 Database seeded successfully with SPA as administrator!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();


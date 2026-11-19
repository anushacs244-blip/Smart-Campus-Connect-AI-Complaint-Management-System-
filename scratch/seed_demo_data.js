/**
 * CampusConnect AI - MongoDB Demo Data Seeder
 * Author: SPA
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import Department from "../models/Department.js";
import Faculty from "../models/Faculty.js";
import Event from "../models/Event.js";
import Notice from "../models/Notice.js";
import University from "../models/University.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusconnect";

async function seed() {
  console.log("Connecting to MongoDB at:", MONGO_URI);
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 });
  console.log("✅ MongoDB Connected for Seeding");

  const passwordHash = await bcrypt.hash("admin123", 10);

  // 1. Users
  console.log("Seeding Users...");
  await User.deleteMany({});
  const [adminUser, preethamUser, preethamDirect, spandanaUser, anushaUser] = await User.create([
    {
      name: "SPA Admin",
      email: "spa@campusconnect.com",
      password: passwordHash,
      role: "admin",
      adminCode: "ADMIN2026",
      department: "Campus Administration"
    },
    {
      name: "Preetham H K",
      email: "student@campus.edu",
      password: passwordHash,
      role: "user",
      rollNumber: "CS-2024-001",
      department: "Computer Science & Engineering"
    },
    {
      name: "Preetham H K",
      email: "preetham@campus.edu",
      password: passwordHash,
      role: "user",
      rollNumber: "CS-2024-001",
      department: "Computer Science & Engineering"
    },
    {
      name: "Spandana M A",
      email: "spandana@campus.edu",
      password: passwordHash,
      role: "user",
      rollNumber: "IS-2024-015",
      department: "Information Science & Engineering"
    },
    {
      name: "Anusha C S",
      email: "anusha@campus.edu",
      password: passwordHash,
      role: "user",
      rollNumber: "EC-2024-028",
      department: "Electronics & Communication Engineering"
    }
  ]);

  // 2. Complaints
  console.log("Seeding Complaints...");
  await Complaint.deleteMany({});
  await Complaint.create([
    {
      studentId: preethamUser._id,
      studentName: "Preetham H K",
      studentEmail: "student@campus.edu",
      studentRoll: "CS-2024-001",
      title: "Wi-Fi Signal Drop in Hostel Block B Study Corridor",
      category: "Hostel",
      complaintLevel: "Level 3 - High",
      incidentDate: "2026-11-18",
      incidentTime: "08:30 PM",
      location: "Hostel Block B, 3rd Floor Room 312",
      description: "The primary Wi-Fi access point in Hostel Block B loses internet connectivity constantly during peak study hours between 8 PM and 11 PM.",
      status: "Under Review",
      adminFeedback: "Campus Network Operations inspected the 3rd floor switch. A replacement dual-band Cisco access point is scheduled for installation today.",
      actionTaken: "Work Order #NET-409 issued to Campus Network Operations",
      evaluatedBy: "SPA Admin",
      evaluatedAt: "2026-11-19 09:30 AM"
    },
    {
      studentId: spandanaUser._id,
      studentName: "Spandana M A",
      studentEmail: "spandana@campus.edu",
      studentRoll: "IS-2024-015",
      title: "Classroom 204 Overhead Projector Display Flickering",
      category: "Infrastructure",
      complaintLevel: "Level 2 - Moderate",
      incidentDate: "2026-11-17",
      incidentTime: "11:15 AM",
      location: "Academic Block A, Smart Classroom 204",
      description: "During database lectures, the projector video flickers intermittently due to a loose HDMI connection on the teaching podium.",
      status: "Resolved",
      adminFeedback: "Hardware inspection completed. The projector wall panel and high-speed 4K HDMI cable were replaced. Display tested and stable.",
      actionTaken: "HDMI wall panel & cable replaced by Audio-Visual Department",
      evaluatedBy: "SPA Admin",
      evaluatedAt: "2026-11-18 03:30 PM"
    },
    {
      studentId: anushaUser._id,
      studentName: "Anusha C S",
      studentEmail: "anusha@campus.edu",
      studentRoll: "EC-2024-028",
      title: "VLSI CAD Simulation Software License Server Inaccessible",
      category: "Laboratory",
      complaintLevel: "Level 4 - Urgent / Emergency",
      incidentDate: "2026-11-18",
      incidentTime: "02:15 PM",
      location: "Building C, VLSI Design Lab Room 102",
      description: "Final-year students working on ASIC simulation capstone projects are locked out due to network license expiry on the departmental server.",
      status: "Under Review",
      adminFeedback: "Escalated to University IT Licensing Cell. 60-seat network license renewed. Lab technician deploying license file update.",
      actionTaken: "License renewed; deployment in progress by ECE Lab Staff",
      evaluatedBy: "SPA Admin",
      evaluatedAt: "2026-11-19 10:15 AM"
    },
    {
      studentId: preethamUser._id,
      studentName: "Preetham H K",
      studentEmail: "student@campus.edu",
      studentRoll: "CS-2024-001",
      title: "Central Canteen RO Water Dispenser Maintenance",
      category: "Canteen",
      complaintLevel: "Level 2 - Moderate",
      incidentDate: "2026-11-16",
      incidentTime: "01:00 PM",
      location: "Campus Central Food Court, Dispenser 2",
      description: "The drinking water dispenser TDS reading was unusually high and water pressure was low during lunch hours.",
      status: "Resolved",
      adminFeedback: "Sanitation and plumbing team serviced the RO water filtration unit. Water quality tested and approved by Campus Health Officer.",
      actionTaken: "RO membrane replaced and TDS meter recalibrated",
      evaluatedBy: "SPA Admin",
      evaluatedAt: "2026-11-17 04:00 PM"
    }
  ]);

  // 3. Departments
  console.log("Seeding Departments...");
  await Department.deleteMany({});
  await Department.create([
    {
      name: "Computer Science & Engineering",
      hod: "Dr. Preetham H K",
      location: "Building A, 3rd Floor, Room 301",
      contact: "preetham.hk@campus.edu | +91 98451 10001"
    },
    {
      name: "Information Science & Engineering",
      hod: "Prof. Spandana M A",
      location: "Building B, 2nd Floor, Room 205",
      contact: "spandana.ma@campus.edu | +91 98452 20002"
    },
    {
      name: "Electronics & Communication Engineering",
      hod: "Dr. Anusha C S",
      location: "Building C, 1st Floor, Room 108",
      contact: "anusha.cs@campus.edu | +91 98453 30003"
    }
  ]);

  // 4. Faculty
  console.log("Seeding Faculty...");
  await Faculty.deleteMany({});
  await Faculty.create([
    {
      name: "Dr. Preetham H K",
      department: "Computer Science & Engineering",
      designation: "Professor & HOD (AI, Cloud & Distributed Systems)",
      email: "preetham.hk@campus.edu"
    },
    {
      name: "Prof. Spandana M A",
      department: "Information Science & Engineering",
      designation: "Associate Professor & HOD (Cybersecurity, Cryptography & Networks)",
      email: "spandana.ma@campus.edu"
    },
    {
      name: "Dr. Anusha C S",
      department: "Electronics & Communication Engineering",
      designation: "Professor & HOD (VLSI Design, Robotics & Embedded IoT)",
      email: "anusha.cs@campus.edu"
    }
  ]);

  // 5. Events
  console.log("Seeding Events...");
  await Event.deleteMany({});
  await Event.create([
    {
      title: "National Smart Campus AI Hackathon 2026 (Lead: Dr. Preetham H K)",
      venue: "Main University Auditorium & Computing Center",
      eventDate: "2026-12-15"
    },
    {
      title: "CyberShield Security Summit 2026 (Convenor: Prof. Spandana M A)",
      venue: "Tech Block Seminar Hall 1",
      eventDate: "2026-11-28"
    },
    {
      title: "IoT & Robotics Innovation Expo (Coordinator: Dr. Anusha C S)",
      venue: "Building C, Electronics Research Hub",
      eventDate: "2026-12-05"
    }
  ]);

  // 6. Notices
  console.log("Seeding Notices...");
  await Notice.deleteMany({});
  await Notice.create([
    {
      title: "B.Tech Mid-Term Exam Schedule Approved by Dr. Preetham H K",
      details: "Examinations will commence from December 1st, 2026. Hall tickets and seating allotments are available on the student portal.",
      issuedBy: "Academic Examination Committee (Dr. Preetham H K)",
      date: "2026-11-18"
    },
    {
      title: "Hands-on Cybersecurity Workshop Announcement by Prof. Spandana M A",
      details: "Two-day hands-on penetration testing and ethical hacking bootcamp. 120 seats available on first-come basis.",
      issuedBy: "Department of ISE (Prof. Spandana M A)",
      date: "2026-11-16"
    },
    {
      title: "Hardware Lab FPGA Component Distribution by Dr. Anusha C S",
      details: "Microcontroller, FPGA, and sensor kits are available for final-year project checkout at the ECE stores.",
      issuedBy: "Department of ECE (Dr. Anusha C S)",
      date: "2026-11-14"
    }
  ]);

  // 7. University
  console.log("Seeding University...");
  const univExists = await University.findOne();
  if (!univExists) {
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
  }

  console.log("🎉 DATABASE SEEDED SUCCESSFULLY WITH DEMO DATA FOR PREETHAM H K, SPANDANA M A, AND ANUSHA C S!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seeding Error:", err.message);
  process.exit(1);
});

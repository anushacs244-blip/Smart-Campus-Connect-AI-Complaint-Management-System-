/**
 * CampusConnect AI - In-Memory Fallback Data Store
 * Author: SPA
 * 
 * Configured with Demo Data for:
 * - Preetham H K
 * - Spandana M A
 * - Anusha C S
 */

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

const defaultPasswordHash = bcrypt.hashSync("admin123", 10);

export const memoryUsers = [
  {
    _id: "u_spa_admin",
    name: "SPA Admin",
    email: "spa@campusconnect.com",
    password: defaultPasswordHash,
    role: "admin",
    adminCode: "ADMIN2026",
    department: "Campus Administration"
  },
  {
    _id: "u_student_preetham",
    name: "Preetham H K",
    email: "student@campus.edu",
    password: defaultPasswordHash,
    role: "user",
    rollNumber: "CS-2024-001",
    department: "Computer Science & Engineering"
  },
  {
    _id: "u_student_preetham_direct",
    name: "Preetham H K",
    email: "preetham@campus.edu",
    password: defaultPasswordHash,
    role: "user",
    rollNumber: "CS-2024-001",
    department: "Computer Science & Engineering"
  },
  {
    _id: "u_student_spandana",
    name: "Spandana M A",
    email: "spandana@campus.edu",
    password: defaultPasswordHash,
    role: "user",
    rollNumber: "IS-2024-015",
    department: "Information Science & Engineering"
  },
  {
    _id: "u_student_anusha",
    name: "Anusha C S",
    email: "anusha@campus.edu",
    password: defaultPasswordHash,
    role: "user",
    rollNumber: "EC-2024-028",
    department: "Electronics & Communication Engineering"
  }
];

export const memoryUniversity = {
  _id: "univ_main",
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
};

export const memoryComplaints = [
  {
    _id: "c_1",
    studentId: "u_student_preetham",
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
    evaluatedAt: "2026-11-19 09:30 AM",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    _id: "c_2",
    studentId: "u_student_spandana",
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
    evaluatedAt: "2026-11-18 03:30 PM",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    _id: "c_3",
    studentId: "u_student_anusha",
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
    evaluatedAt: "2026-11-19 10:15 AM",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: "c_4",
    studentId: "u_student_preetham",
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
    evaluatedAt: "2026-11-17 04:00 PM",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const memoryDepartments = [
  {
    _id: "d1",
    name: "Computer Science & Engineering",
    hod: "Dr. Preetham H K",
    location: "Building A, 3rd Floor, Room 301",
    contact: "preetham.hk@campus.edu | +91 98451 10001"
  },
  {
    _id: "d2",
    name: "Information Science & Engineering",
    hod: "Prof. Spandana M A",
    location: "Building B, 2nd Floor, Room 205",
    contact: "spandana.ma@campus.edu | +91 98452 20002"
  },
  {
    _id: "d3",
    name: "Electronics & Communication Engineering",
    hod: "Dr. Anusha C S",
    location: "Building C, 1st Floor, Room 108",
    contact: "anusha.cs@campus.edu | +91 98453 30003"
  }
];

export const memoryFaculty = [
  {
    _id: "f1",
    name: "Dr. Preetham H K",
    department: "Computer Science & Engineering",
    designation: "Professor & HOD (AI, Cloud & Distributed Systems)",
    email: "preetham.hk@campus.edu"
  },
  {
    _id: "f2",
    name: "Prof. Spandana M A",
    department: "Information Science & Engineering",
    designation: "Associate Professor & HOD (Cybersecurity, Cryptography & Networks)",
    email: "spandana.ma@campus.edu"
  },
  {
    _id: "f3",
    name: "Dr. Anusha C S",
    department: "Electronics & Communication Engineering",
    designation: "Professor & HOD (VLSI Design, Robotics & Embedded IoT)",
    email: "anusha.cs@campus.edu"
  }
];

export const memoryEvents = [
  {
    _id: "e1",
    title: "National Smart Campus AI Hackathon 2026 (Lead: Dr. Preetham H K)",
    venue: "Main University Auditorium & Computing Center",
    eventDate: "2026-12-15"
  },
  {
    _id: "e2",
    title: "CyberShield Security Summit 2026 (Convenor: Prof. Spandana M A)",
    venue: "Tech Block Seminar Hall 1",
    eventDate: "2026-11-28"
  },
  {
    _id: "e3",
    title: "IoT & Robotics Innovation Expo (Coordinator: Dr. Anusha C S)",
    venue: "Building C, Electronics Research Hub",
    eventDate: "2026-12-05"
  }
];

export const memoryFacilities = [
  { _id: "fc1", name: "Central Library & Digital Knowledge Hub", location: "Academic Block 1, Ground Floor", timings: "8:00 AM - 9:00 PM" },
  { _id: "fc2", name: "AI, Cloud & High-Performance Computing Lab", location: "Building A, Lab 304", timings: "9:00 AM - 7:00 PM" },
  { _id: "fc3", name: "Cybersecurity & Hardware Research Lab", location: "Building B, Lab 202", timings: "9:00 AM - 6:00 PM" },
  { _id: "fc4", name: "Campus Cafeteria & Food Court", location: "Central Campus Plaza", timings: "7:30 AM - 9:00 PM" },
  { _id: "fc5", name: "Sports Complex & Gymnasium", location: "West Wing Ground", timings: "6:00 AM - 7:30 PM" }
];

export const memoryNotices = [
  {
    _id: "n1",
    title: "B.Tech Mid-Term Exam Schedule Approved by Dr. Preetham H K",
    details: "Examinations will commence from December 1st, 2026. Hall tickets and seating allotments are available on the student portal.",
    issuedBy: "Academic Examination Committee (Dr. Preetham H K)",
    date: "2026-11-18"
  },
  {
    _id: "n2",
    title: "Hands-on Cybersecurity Workshop Announcement by Prof. Spandana M A",
    details: "Two-day hands-on penetration testing and ethical hacking bootcamp. 120 seats available on first-come basis.",
    issuedBy: "Department of ISE (Prof. Spandana M A)",
    date: "2026-11-16"
  },
  {
    _id: "n3",
    title: "Hardware Lab FPGA Component Distribution by Dr. Anusha C S",
    details: "Microcontroller, FPGA, and sensor kits are available for final-year project checkout at the ECE stores.",
    issuedBy: "Department of ECE (Dr. Anusha C S)",
    date: "2026-11-14"
  }
];

export const memoryCache = new Map();

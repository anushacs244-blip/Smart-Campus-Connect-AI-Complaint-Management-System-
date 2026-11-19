/**
 * CampusConnect AI - University Model
 * Author: SPA
 */

import mongoose from "mongoose";

const universitySchema = new mongoose.Schema({
  name: { type: String, default: "Smart Campus University" },
  code: { type: String, default: "SCU-2026" },
  chancellor: { type: String, default: "Dr. S. P. Acharya" },
  viceChancellor: { type: String, default: "Prof. A. R. Sharma" },
  location: { type: String, default: "Knowledge Park, Tech Campus, Building Central" },
  establishedYear: { type: String, default: "2008" },
  accreditation: { type: String, default: "NAAC A++ Grade, AICTE Approved, UGC Recognized" },
  website: { type: String, default: "https://smartcampus.edu" },
  contactEmail: { type: String, default: "info@smartcampus.edu" },
  contactPhone: { type: String, default: "+91 98765 43210" },
  about: {
    type: String,
    default: "Smart Campus University is a premier multidisciplinary institution empowering students with cutting-edge AI, modern engineering, and world-class campus facilities."
  },
  vision: {
    type: String,
    default: "To foster innovative thinkers, AI-ready engineers, and leaders who impact society positively."
  },
  mission: {
    type: String,
    default: "Deliver holistic education, encourage high-impact research, and provide transparent smart campus governance."
  }
}, { timestamps: true });

export default mongoose.model("University", universitySchema);


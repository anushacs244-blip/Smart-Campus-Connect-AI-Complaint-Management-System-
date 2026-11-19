/**
 * CampusConnect AI - Smart Campus Assistant
 * Author: SPA
 * 
 * Intelligent Knowledge-Base Query Engine:
 * - Always queries LIVE storage (MongoDB or memoryStore) with zero stale cache.
 * - Any newly added notice, event, faculty, or department is IMMEDIATELY queryable.
 * - Entity-first matching (Faculty, Events, Notices, Departments, Facilities).
 * - Comprehensive "Recently Added" dashboard for "what's recent / latest / new".
 * - Multi-word ranked semantic search across all collections for any arbitrary questions.
 */

import express from "express";
import axios from "axios";
import natural from "natural";
import path from "path";
import { fileURLToPath } from "url";

import Event from "../models/Event.js";
import Department from "../models/Department.js";
import Faculty from "../models/Faculty.js";
import Facility from "../models/Facility.js";
import Notice from "../models/Notice.js";
import University from "../models/University.js";

import {
  isDbConnected,
  memoryDepartments,
  memoryFaculty,
  memoryEvents,
  memoryFacilities,
  memoryNotices,
  memoryUniversity
} from "../memoryStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ---------------- ML CLASSIFIER ----------------
let classifier;
const modelPath = path.join(__dirname, "../ml/model.json");

natural.BayesClassifier.load(modelPath, null, (err, cl) => {
  if (err) {
    console.log("ML model load note:", err.message);
  } else {
    classifier = cl;
    console.log("✅ ML intent classifier active (Author: SPA)");
  }
});

// ---------------- STOPWORDS TO FILTER FOR UNIVERSAL SEARCH ----------------
const STOP_WORDS = new Set([
  "what", "whats", "is", "the", "are", "tell", "me", "about", "show", "can",
  "you", "please", "in", "at", "for", "of", "to", "a", "an", "and", "or",
  "how", "do", "does", "who", "which", "when", "where", "why", "i", "need",
  "give", "details", "info", "information", "any", "some", "there", "have",
  "college", "campus", "university"
]);

// ---------------- NORMALIZE QUERY ----------------
function normalize(q) {
  if (!q) return "";
  return q
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(q) {
  const norm = normalize(q);
  return norm
    .split(" ")
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

// ---------------- CHAT ROUTE ----------------
router.post("/", async (req, res) => {
  try {
    const rawQuestion = (req.body.message || "").trim();
    if (!rawQuestion) {
      return res.json({
        reply: "Hello! 👋 Please ask a question about campus, recent notices, upcoming events, faculty members, facilities, or student complaints."
      });
    }

    let userQuestion = normalize(rawQuestion);

    // Common acronym substitutions
    userQuestion = userQuestion
      .replace(/\bcs\b/g, "computer engineering")
      .replace(/\bcomp\b/g, "computer engineering")
      .replace(/\bit\b/g, "information technology")
      .replace(/\bextc\b/g, "electronics engineering")
      .replace(/\bvc\b/g, "vice chancellor");

    // ---------------- 1. FETCH LIVE STORAGE DATA (ZERO CACHE FREEZE) ----------------
    const getNotices = async () => {
      if (isDbConnected()) {
        return await Notice.find().sort({ createdAt: -1, date: -1, _id: -1 });
      }
      return memoryNotices;
    };

    const getEvents = async () => {
      if (isDbConnected()) {
        return await Event.find().sort({ createdAt: -1, eventDate: -1, _id: -1 });
      }
      return memoryEvents;
    };

    const getDepartments = async () => {
      if (isDbConnected()) {
        return await Department.find().sort({ _id: -1 });
      }
      return memoryDepartments;
    };

    const getFaculty = async () => {
      if (isDbConnected()) {
        return await Faculty.find().sort({ _id: -1 });
      }
      return memoryFaculty;
    };

    const getFacilities = async () => {
      if (isDbConnected()) {
        return await Facility.find().sort({ _id: -1 });
      }
      return memoryFacilities;
    };

    const getUniversity = async () => {
      if (isDbConnected()) {
        const u = await University.findOne();
        return u || memoryUniversity;
      }
      return memoryUniversity;
    };

    const [notices, events, departments, facultyList, facilities, university] = await Promise.all([
      getNotices(),
      getEvents(),
      getDepartments(),
      getFaculty(),
      getFacilities(),
      getUniversity()
    ]);

    // Intent hint from Bayes Classifier
    let predictedIntent = "unknown";
    if (classifier) {
      try {
        predictedIntent = classifier.classify(userQuestion);
      } catch (e) {
        // ignore
      }
    }
    console.log(`[AI Query]: "${rawQuestion}" | Predicted Intent: ${predictedIntent}`);

    let responseText = "";

    // =========================================================================
    // STEP A: GREETING
    // =========================================================================
    if (
      predictedIntent === "greeting" ||
      ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"].includes(userQuestion)
    ) {
      const newestNotice = notices[0]?.title || "Mid-term Exam Schedule";
      const newestEvent = events[0]?.title || "Smart India Hackathon";
      responseText =
        `Hello! 👋 I am the **Smart Campus Assistant** for **${university.name}** (Developed by SPA).\n\n` +
        `I am connected directly to real-time campus storage! Here is what you can ask me:\n` +
        `• 🆕 *"What is recent?"* — Shows the newest notices, upcoming events, and fresh updates\n` +
        `• 📢 *"Show latest notices"* — View all current announcements (Latest: *${newestNotice}*)\n` +
        `• 📅 *"Upcoming events"* — See workshops, hackathons & fests (Next: *${newestEvent}*)\n` +
        `• 👨‍🏫 *"Who is [Faculty Name]?"* — Look up any professor or teacher\n` +
        `• 🏢 *"Who is HOD of CS?"* — Department heads, locations, and contacts\n` +
        `• 🏛️ *"Library timings"* or *"Campus facilities"* — Hours and lab locations\n` +
        `• 📝 *"How to raise a complaint?"* — Guide for the Student Grievance Portal\n` +
        `• 🏛️ *"Who is the Vice Chancellor?"* — University leadership & NAAC grade`;
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP B: SPECIFIC FACULTY NAME LOOKUP (PRIORITY OVER GENERAL QUERIES)
    // Checks if the user is asking about a specific person in the faculty list
    // =========================================================================
    const matchedFacultyList = facultyList.filter(f => {
      const fNameNorm = normalize(f.name);
      const nameParts = fNameNorm.split(" ").filter(p => p.length > 2 && !["dr", "prof", "mr", "mrs", "ms"].includes(p));
      // Does user query contain full name or any distinctive name part?
      if (userQuestion.includes(fNameNorm)) return true;
      return nameParts.some(part => userQuestion.includes(part));
    });

    if (matchedFacultyList.length > 0 && !userQuestion.includes("all faculty") && !userQuestion.includes("faculty list")) {
      responseText = `👨‍🏫 **Faculty Profile Details:**\n\n` +
        matchedFacultyList.map(f =>
          `• **${f.name}**\n` +
          `  - **Designation:** ${f.designation}\n` +
          `  - **Department:** ${f.department}\n` +
          `  - **Official Email:** ${f.email || "Contact via department office"}`
        ).join("\n\n");
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP C: SPECIFIC EVENT NAME MATCHING
    // If user query mentions a specific event title or event keyword
    // =========================================================================
    const matchedEventsList = events.filter(e => {
      const eTitleNorm = normalize(e.title);
      if (userQuestion.includes(eTitleNorm)) return true;
      const keyWords = eTitleNorm.split(" ").filter(w => w.length > 3 && !["annual", "campus", "fest", "event", "workshop", "2026"].includes(w));
      return keyWords.some(k => userQuestion.includes(k));
    });

    if (
      matchedEventsList.length > 0 &&
      !userQuestion.includes("all events") &&
      !userQuestion.includes("list events") &&
      !userQuestion.includes("show events") &&
      !userQuestion.includes("what is recent") &&
      !userQuestion.includes("recent updates")
    ) {
      responseText = `📅 **Matching Event Information:**\n\n` +
        matchedEventsList.map(e =>
          `• **${e.title}**\n` +
          `  - **Date:** ${e.eventDate}\n` +
          `  - **Venue:** ${e.venue}`
        ).join("\n\n");
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP D: SPECIFIC NOTICE MATCHING BY TITLE OR KEYWORD
    // If user mentions a specific notice topic (e.g. "placement", "exam", "holiday")
    // =========================================================================
    const matchedNoticesList = notices.filter(n => {
      const nTitleNorm = normalize(n.title);
      if (userQuestion.includes(nTitleNorm)) return true;
      const keyWords = nTitleNorm.split(" ").filter(w => w.length > 3 && !["notice", "released", "schedule", "drive"].includes(w));
      return keyWords.length > 0 && keyWords.some(k => userQuestion.includes(k));
    });

    if (
      matchedNoticesList.length > 0 &&
      !userQuestion.includes("all notices") &&
      !userQuestion.includes("list notices") &&
      !userQuestion.includes("show notices") &&
      !userQuestion.includes("what is recent") &&
      !userQuestion.includes("recent updates") &&
      !userQuestion.includes("latest notice")
    ) {
      responseText = `📢 **Matching Campus Notice:**\n\n` +
        matchedNoticesList.map((n, idx) =>
          `${idx + 1}. **${n.title}** (${n.date || "Recent"})\n` +
          `   • **Details:** ${n.details}\n` +
          `   • **Issued By:** ${n.issuedBy || "Administration"}`
        ).join("\n\n");
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP E: RECENT UPDATES / "WHAT'S NEW" / "RECENTLY ADDED"
    // Displays newest items added by admin across Notices, Events, and Faculty!
    // =========================================================================
    const isAskingRecent =
      predictedIntent === "recent_updates" ||
      userQuestion.includes("what is recent") ||
      userQuestion.includes("whats recent") ||
      userQuestion.includes("whats new") ||
      userQuestion.includes("what is new") ||
      userQuestion.includes("recent updates") ||
      userQuestion.includes("latest updates") ||
      userQuestion.includes("show recent") ||
      userQuestion.includes("show latest") ||
      userQuestion.includes("what was added recently") ||
      userQuestion.includes("what happened recently") ||
      userQuestion.includes("any new updates") ||
      userQuestion.includes("recently added") ||
      userQuestion.includes("new additions") ||
      userQuestion === "recent" ||
      userQuestion === "latest" ||
      userQuestion === "new";

    if (isAskingRecent) {
      let parts = ["🆕 **Recently Added to Campus Connect (Live Storage):**\n"];

      // Top 3 Newest Notices
      if (notices.length > 0) {
        parts.push("📢 **Latest Notices & Announcements:**");
        notices.slice(0, 3).forEach((n, i) => {
          parts.push(`  ${i + 1}. **${n.title}** (${n.date || "Recent"})\n     ${n.details} [By: ${n.issuedBy || "Admin"}]`);
        });
        parts.push("");
      }

      // Top 2 Upcoming Events
      if (events.length > 0) {
        parts.push("📅 **Upcoming Events & Fests:**");
        events.slice(0, 2).forEach((e, i) => {
          parts.push(`  ${i + 1}. **${e.title}**\n     Date: ${e.eventDate} | Venue: ${e.venue}`);
        });
        parts.push("");
      }

      // Newest Faculty addition
      if (facultyList.length > 0) {
        const latestF = facultyList[0];
        parts.push(`👨‍🏫 **Faculty Spotlight:** **${latestF.name}** (${latestF.designation}, ${latestF.department})`);
        parts.push("");
      }

      parts.push("💡 *Tip: You can ask specific questions about any of the items above, and newly added admin updates will appear immediately!*");
      responseText = parts.join("\n");
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP F: SPECIFIC UNIVERSITY ATTRIBUTES (CHANCELLOR, VC, LOCATION, ETC.)
    // Note: We only trigger these if the user explicitly asks for that specific attribute!
    // =========================================================================
    const u = university;
    if (userQuestion.includes("vice chancellor") || userQuestion.includes("vc")) {
      responseText = `🏛️ **Vice Chancellor:** The Vice Chancellor of ${u.name} is **${u.viceChancellor}**.`;
      return res.json({ reply: responseText });
    }

    if (userQuestion.includes("chancellor") && !userQuestion.includes("vice")) {
      responseText = `🏛️ **Chancellor:** The Chancellor of ${u.name} is **${u.chancellor}**.`;
      return res.json({ reply: responseText });
    }

    if (
      userQuestion.includes("where is university") ||
      userQuestion.includes("where is campus") ||
      userQuestion.includes("university location") ||
      userQuestion.includes("campus location") ||
      userQuestion.includes("campus address") ||
      userQuestion.includes("college address")
    ) {
      responseText = `📍 **Campus Location & Address:**\n**${u.name}** is located at **${u.location}**.`;
      return res.json({ reply: responseText });
    }

    if (userQuestion.includes("established") || userQuestion.includes("founded") || userQuestion.includes("establishment year")) {
      responseText = `📅 **Establishment:** **${u.name}** was established in the year **${u.establishedYear}**.`;
      return res.json({ reply: responseText });
    }

    if (userQuestion.includes("accreditation") || userQuestion.includes("naac") || userQuestion.includes("grade")) {
      responseText = `🏅 **Accreditation & Approvals:**\n**${u.name}** holds: **${u.accreditation}**.`;
      return res.json({ reply: responseText });
    }

    if (userQuestion.includes("contact email") || userQuestion.includes("phone number") || userQuestion.includes("contact info") || userQuestion.includes("website")) {
      responseText = `📞 **Official Contact Information for ${u.name}:**\n• **Website:** ${u.website}\n• **Email:** ${u.contactEmail}\n• **Phone:** ${u.contactPhone}\n• **Institution Code:** ${u.code || "SCU-2026"}`;
      return res.json({ reply: responseText });
    }

    if (userQuestion.includes("vision") || userQuestion.includes("mission")) {
      responseText = `🎯 **${u.name} Institutional Goals:**\n• **Vision:** ${u.vision}\n• **Mission:** ${u.mission}`;
      return res.json({ reply: responseText });
    }

    if (
      userQuestion.includes("tell me about the university") ||
      userQuestion.includes("about university") ||
      userQuestion.includes("about the college") ||
      userQuestion.includes("university overview") ||
      userQuestion.includes("university profile") ||
      userQuestion.includes("tell me about college") ||
      userQuestion === "university details" ||
      userQuestion === "college details"
    ) {
      responseText =
        `🏛️ **${u.name} (${u.code || "SCU-2026"})**\n` +
        `• **Chancellor:** ${u.chancellor}\n` +
        `• **Vice Chancellor:** ${u.viceChancellor}\n` +
        `• **Location:** ${u.location}\n` +
        `• **Established:** ${u.establishedYear}\n` +
        `• **Accreditation:** ${u.accreditation}\n` +
        `• **Contact:** ${u.contactEmail} | ${u.contactPhone}\n` +
        `• **Website:** ${u.website}\n` +
        `• **About:** ${u.about}`;
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP G: NOTICES & ANNOUNCEMENTS (NEWEST FIRST)
    // =========================================================================
    if (
      predictedIntent === "notice_query" ||
      userQuestion.includes("notice") ||
      userQuestion.includes("notices") ||
      userQuestion.includes("announcement") ||
      userQuestion.includes("announcements") ||
      userQuestion.includes("circular") ||
      userQuestion.includes("circulars") ||
      userQuestion.includes("notice board")
    ) {
      if (notices.length === 0) {
        responseText = "📢 Currently there are no official notices on the campus board.";
      } else {
        responseText = `📢 **Campus Notices & Announcements (Latest First):**\n\n` +
          notices.map((n, idx) => {
            const badge = idx === 0 ? " 🆕 [Latest]" : "";
            return `${idx + 1}. **${n.title}**${badge} (${n.date || "Recent"})\n   • Details: ${n.details}\n   • Issued By: ${n.issuedBy || "Administration"}`;
          }).join("\n\n");
      }
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP H: EVENTS & FESTS (NEWEST FIRST)
    // =========================================================================
    if (
      predictedIntent === "event_query" ||
      userQuestion.includes("event") ||
      userQuestion.includes("events") ||
      userQuestion.includes("fest") ||
      userQuestion.includes("fests") ||
      userQuestion.includes("hackathon") ||
      userQuestion.includes("workshop") ||
      userQuestion.includes("seminar") ||
      userQuestion.includes("competition")
    ) {
      if (events.length === 0) {
        responseText = "📅 No campus events or workshops are currently scheduled.";
      } else {
        responseText = `📅 **Campus Events & Workshops (Latest First):**\n\n` +
          events.map((e, idx) => {
            const badge = idx === 0 ? " 🆕 [Upcoming]" : "";
            return `${idx + 1}. **${e.title}**${badge}\n   • Date: ${e.eventDate}\n   • Venue: ${e.venue}`;
          }).join("\n\n");
      }
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP I: FACULTY DIRECTORY & TEACHERS LIST
    // =========================================================================
    if (
      predictedIntent === "faculty_query" ||
      userQuestion.includes("faculty") ||
      userQuestion.includes("faculties") ||
      userQuestion.includes("teacher") ||
      userQuestion.includes("teachers") ||
      userQuestion.includes("professor") ||
      userQuestion.includes("professors") ||
      userQuestion.includes("who teaches")
    ) {
      if (facultyList.length === 0) {
        responseText = "👨‍🏫 No faculty records found in storage.";
      } else {
        responseText = `👨‍🏫 **Campus Faculty Directory (${facultyList.length} Members):**\n\n` +
          facultyList.map((f, idx) =>
            `${idx + 1}. **${f.name}**\n   • Designation: ${f.designation}\n   • Department: ${f.department}\n   • Email: ${f.email || "N/A"}`
          ).join("\n\n");
      }
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP J: DEPARTMENTS & HOD DETAILS
    // =========================================================================
    if (
      predictedIntent === "department_hod" ||
      userQuestion.includes("hod") ||
      userQuestion.includes("head of department") ||
      userQuestion.includes("department") ||
      userQuestion.includes("departments")
    ) {
      if (departments.length === 0) {
        responseText = "🏢 No department records found in storage.";
      } else {
        // Look for specific department mention
        const matchedDept = departments.find(d => {
          const dNameNorm = normalize(d.name);
          return userQuestion.includes(dNameNorm) ||
                 (dNameNorm.includes("computer") && userQuestion.includes("computer")) ||
                 (dNameNorm.includes("information") && userQuestion.includes("information")) ||
                 (dNameNorm.includes("electronics") && userQuestion.includes("electronics"));
        });

        if (matchedDept) {
          responseText =
            `🏢 **${matchedDept.name} Department:**\n` +
            `• **Head of Department (HOD):** ${matchedDept.hod}\n` +
            `• **Location / Office:** ${matchedDept.location}\n` +
            `• **Contact:** ${matchedDept.contact || "N/A"}`;
        } else {
          responseText = `🏢 **Academic Departments & HOD Directory:**\n\n` +
            departments.map((d, idx) =>
              `${idx + 1}. **${d.name}**\n   • HOD: ${d.hod}\n   • Location: ${d.location}\n   • Contact: ${d.contact || "N/A"}`
            ).join("\n\n");
        }
      }
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP K: FACILITIES (LIBRARY, LABS, CANTEEN, SPORTS, ETC.)
    // =========================================================================
    if (
      predictedIntent === "facility_query" ||
      userQuestion.includes("facility") ||
      userQuestion.includes("facilities") ||
      userQuestion.includes("library") ||
      userQuestion.includes("lab") ||
      userQuestion.includes("canteen") ||
      userQuestion.includes("cafeteria") ||
      userQuestion.includes("sports") ||
      userQuestion.includes("gym") ||
      userQuestion.includes("timings") ||
      userQuestion.includes("timing")
    ) {
      if (facilities.length === 0) {
        responseText = "🏛️ No facility records found in storage.";
      } else {
        const matchedFac = facilities.find(f => {
          const fNorm = normalize(f.name);
          return userQuestion.includes(fNorm) ||
                 (fNorm.includes("library") && userQuestion.includes("library")) ||
                 (fNorm.includes("lab") && userQuestion.includes("lab")) ||
                 (fNorm.includes("canteen") && (userQuestion.includes("canteen") || userQuestion.includes("cafeteria"))) ||
                 (fNorm.includes("sports") && userQuestion.includes("sports"));
        });

        if (matchedFac) {
          responseText =
            `🏛️ **${matchedFac.name}:**\n` +
            `• **Location:** ${matchedFac.location}\n` +
            `• **Operating Hours / Timings:** ${matchedFac.timings || "Open during standard campus hours"}`;
        } else {
          responseText = `🏛️ **Campus Facilities & Operating Hours:**\n\n` +
            facilities.map((f, idx) =>
              `${idx + 1}. **${f.name}**\n   • Location: ${f.location}\n   • Timings: ${f.timings || "Standard campus hours"}`
            ).join("\n\n");
        }
      }
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP L: STUDENT COMPLAINT & GRIEVANCE REDRESSAL HELP
    // =========================================================================
    if (
      predictedIntent === "complaint_help" ||
      userQuestion.includes("complaint") ||
      userQuestion.includes("grievance") ||
      userQuestion.includes("ragging") ||
      userQuestion.includes("problem") ||
      userQuestion.includes("lodge") ||
      userQuestion.includes("feedback")
    ) {
      responseText =
        "📝 **Student Grievance & Complaint Redressal System:**\n\n" +
        "Students can report campus issues with full lifecycle tracking:\n" +
        "1. Click **'Student Portal'** in the top navigation.\n" +
        "2. Click **'Lodge New Complaint'**.\n" +
        "3. Choose your Category (*Hostel, Academics, Infrastructure, Lab, Canteen, Examination, etc.*).\n" +
        "4. Choose Severity Level (*Level 1 - Low* to *Level 4 - Urgent/Emergency*).\n" +
        "5. Fill in the incident date, time, location, and clear description.\n" +
        "6. **Admin Evaluation:** Campus administrators evaluate the grievance, log corrective action, and return official feedback directly to your student dashboard!";
      return res.json({ reply: responseText });
    }

    // =========================================================================
    // STEP M: UNIVERSAL RANKED SEARCH ACROSS ALL COLLECTIONS
    // For any custom, extra, or recently added items not caught above!
    // =========================================================================
    const keywords = extractKeywords(rawQuestion);

    if (keywords.length > 0) {
      let scoredResults = [];

      // Score Notices
      notices.forEach(n => {
        let score = 0;
        const text = `${n.title} ${n.details} ${n.issuedBy}`.toLowerCase();
        keywords.forEach(k => {
          if (n.title.toLowerCase().includes(k)) score += 3;
          if (text.includes(k)) score += 1;
        });
        if (score > 0) {
          scoredResults.push({
            type: "Notice",
            score,
            content: `📢 **Notice:** **${n.title}** (${n.date || "Recent"})\n   ${n.details} [Issued By: ${n.issuedBy || "Admin"}]`
          });
        }
      });

      // Score Events
      events.forEach(e => {
        let score = 0;
        const text = `${e.title} ${e.venue}`.toLowerCase();
        keywords.forEach(k => {
          if (e.title.toLowerCase().includes(k)) score += 3;
          if (text.includes(k)) score += 1;
        });
        if (score > 0) {
          scoredResults.push({
            type: "Event",
            score,
            content: `📅 **Event:** **${e.title}** on ${e.eventDate} at ${e.venue}`
          });
        }
      });

      // Score Faculty
      facultyList.forEach(f => {
        let score = 0;
        const text = `${f.name} ${f.department} ${f.designation}`.toLowerCase();
        keywords.forEach(k => {
          if (f.name.toLowerCase().includes(k)) score += 4;
          if (text.includes(k)) score += 1;
        });
        if (score > 0) {
          scoredResults.push({
            type: "Faculty",
            score,
            content: `👨‍🏫 **Faculty:** **${f.name}** (${f.designation}, ${f.department}) - Email: ${f.email || "N/A"}`
          });
        }
      });

      // Score Departments
      departments.forEach(d => {
        let score = 0;
        const text = `${d.name} ${d.hod} ${d.location}`.toLowerCase();
        keywords.forEach(k => {
          if (d.name.toLowerCase().includes(k)) score += 3;
          if (text.includes(k)) score += 1;
        });
        if (score > 0) {
          scoredResults.push({
            type: "Department",
            score,
            content: `🏢 **Department:** **${d.name}** - HOD: ${d.hod} (${d.location})`
          });
        }
      });

      // Score Facilities
      facilities.forEach(fac => {
        let score = 0;
        const text = `${fac.name} ${fac.location}`.toLowerCase();
        keywords.forEach(k => {
          if (fac.name.toLowerCase().includes(k)) score += 3;
          if (text.includes(k)) score += 1;
        });
        if (score > 0) {
          scoredResults.push({
            type: "Facility",
            score,
            content: `🏛️ **Facility:** **${fac.name}** at ${fac.location} (Timings: ${fac.timings || "Campus hours"})`
          });
        }
      });

      // If matches were found
      if (scoredResults.length > 0) {
        scoredResults.sort((a, b) => b.score - a.score);
        const topMatches = scoredResults.slice(0, 4);
        responseText = `🔍 **Search Results for "${rawQuestion}":**\n\n` +
          topMatches.map(m => m.content).join("\n\n");
        return res.json({ reply: responseText });
      }
    }

    // =========================================================================
    // STEP N: GEMINI LLM AUGMENTATION (IF GEMINI_KEY SUPPLIED)
    // =========================================================================
    if (process.env.GEMINI_KEY && process.env.GEMINI_KEY.trim() !== "") {
      try {
        const liveCampusContext = {
          university,
          latestNotices: notices.slice(0, 5),
          upcomingEvents: events.slice(0, 5),
          departments,
          faculty: facultyList,
          facilities
        };

        const prompt = `
You are the Smart Campus Assistant for ${university.name}, developed by SPA.
Answer the user query based on the following LIVE database storage.
Always prioritize newly added notices and events.

LIVE CAMPUS DATA:
${JSON.stringify(liveCampusContext)}

USER QUESTION:
${rawQuestion}
`;

        const ai = await axios({
          method: "POST",
          url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
          params: { key: process.env.GEMINI_KEY },
          headers: { "Content-Type": "application/json" },
          data: { contents: [{ parts: [{ text: prompt }] }] },
          timeout: 6000
        });

        const aiText = ai.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText && aiText.trim()) {
          return res.json({ reply: aiText.trim() });
        }
      } catch (geminiErr) {
        console.log("Gemini fallback skipped:", geminiErr.message);
      }
    }

    // =========================================================================
    // STEP O: SMART DYNAMIC FALLBACK (ZERO DEAD ENDS, NEVER STATIC OVERVIEW)
    // Tells user what is actually stored in the database right now!
    // =========================================================================
    const sampleNotice = notices[0]?.title ? `"${notices[0].title}"` : '"Mid-term Schedule"';
    const sampleEvent = events[0]?.title ? `"${events[0].title}"` : '"Tech Fest"';
    const sampleFaculty = facultyList[0]?.name || "faculty members";

    responseText =
      `I searched our live campus database for **"${rawQuestion}"**, but couldn't find an exact match.\n\n` +
      `💡 **Here is what you can ask me right now:**\n` +
      `• *"What is recent?"* — Shows the newest notices and upcoming events\n` +
      `• *"Show latest notices"* — View latest notice: ${sampleNotice}\n` +
      `• *"List upcoming events"* — View upcoming event: ${sampleEvent}\n` +
      `• *"Who is ${sampleFaculty}?"* — Or ask about any teacher or HOD\n` +
      `• *"Who is the Vice Chancellor?"* or *"Tell me about the university"*\n` +
      `• *"How to raise a student complaint?"* — Grievance filing & admin evaluation`;

    return res.json({ reply: responseText });

  } catch (error) {
    console.error("Chat Server Error:", error.message);
    res.status(500).json({
      reply: "Sorry, I encountered an internal error while searching campus storage. Please try again."
    });
  }
});

export default router;

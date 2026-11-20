/**
 * CampusConnect AI - Main Interface & AI Campus Assistant
 * Author: SPA
 */

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Bot,
  Send,
  GraduationCap,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Clock
} from "lucide-react";

export default function GetStarted() {
  const navigate = useNavigate();

  // AI Chat state on Main Interface
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    {
      u: "What is recent?",
      b: "🆕 **Recently Added to Campus Connect (Live Storage):**\n\n📢 **Latest Notices & Announcements:**\n  1. **B.Tech Mid-Term Exam Schedule Approved by Dr. Preetham H K** (2026-11-18)\n     Examinations will commence from December 1st, 2026. Hall tickets available on portal.\n\n📅 **Upcoming Events & Fests:**\n  1. **National Smart Campus AI Hackathon 2026 (Lead: Dr. Preetham H K)**\n     Date: 2026-12-15 | Venue: Main University Auditorium\n  2. **CyberShield Security Summit 2026 (Convenor: Prof. Spandana M A)**\n     Date: 2026-11-28 | Venue: Tech Block Seminar Hall 1\n\n👨‍🏫 **Faculty Spotlight:** **Dr. Preetham H K** (Professor & HOD, Computer Science & Engineering) & **Prof. Spandana M A** (HOD, Information Science) & **Dr. Anusha C S** (HOD, Electronics Engineering)\n\n💡 *Tip: You can ask specific questions about Dr. Preetham H K, Prof. Spandana M A, or Dr. Anusha C S, or any new notice, event, or complaint!*"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const send = async (textToSend) => {
    const message = (textToSend || msg).trim();
    if (!message || loading) return;

    const userMessage = message;
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { message: userMessage });
      setChat(prev => [...prev, { u: userMessage, b: res.data.reply }]);
    } catch (err) {
      setChat(prev => [
        ...prev,
        { u: userMessage, b: "Error connecting to campus server. Please ensure backend is active on port 5000." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  const quickPrompts = [
    "What is recent?",
    "Who is Dr. Preetham H K?",
    "Who is Prof. Spandana M A?",
    "Who is Dr. Anusha C S?",
    "Show latest notices",
    "List upcoming events",
    "Who is HOD of CS?",
    "How to raise a complaint?"
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* 🔹 Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 md:px-12 py-3.5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              Smart Campus Connect
            </h1>
            <p className="text-xs text-indigo-600 font-semibold">Developed by SPA</p>
          </div>
        </div>

        {/* Separate Portal Navigation */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => navigate("/login", { state: { initialTab: "student" } })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs md:text-sm transition border border-indigo-200"
          >
            <GraduationCap size={16} />
            <span>Complaint Management System</span>
          </button>

          <button
            onClick={() => navigate("/login", { state: { initialTab: "admin" } })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs md:text-sm transition shadow-sm"
          >
            <ShieldCheck size={16} />
            <span>Admin Portal</span>
          </button>
        </div>
      </nav>

      {/* 🔹 Hero Header */}
      <header className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 text-white px-6 md:px-12 py-10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-xs font-semibold mb-3 backdrop-blur-sm">
            ✨ AI Campus Intelligence • Student Complaint Management System • Admin Evaluation Center
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Smart Campus Assistant & Complaint Management System
          </h2>
          <p className="mt-2 text-sm md:text-base text-indigo-100 max-w-2xl mx-auto">
            Ask any question to the live AI Assistant below, lodge and track campus grievances in the Student Complaint Management System, or evaluate complaints in the Admin Center.
          </p>
        </div>
      </header>

      {/* 🔹 Interactive AI Conversation Tool (MAIN INTERFACE ONLY) */}
      <section className="max-w-5xl mx-auto w-full px-4 md:px-6 -mt-6 flex-1 pb-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
          {/* Chat Header */}
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-indigo-600" />
              <span className="text-sm font-bold text-slate-800">
                AI Campus Assistant (Live Main Interface)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                Online
              </span>
            </div>
            <span className="text-xs text-slate-400">Powered by Naive Bayes ML & Campus Storage</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 bg-gradient-to-b from-white to-slate-50">
            {chat.map((c, i) => (
              <div key={i} className="space-y-2">
                {/* User Bubble */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm max-w-[80%] text-sm">
                    {c.u}
                  </div>
                </div>

                {/* Bot Bubble */}
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%] border border-slate-200 text-xs md:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                    {c.b}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-xs text-indigo-600 font-semibold animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></span>
                AI is searching campus database...
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
              <Sparkles size={12} className="text-amber-500" /> Quick Ask:
            </span>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => send(q)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 text-xs shrink-0 font-medium transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3.5 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about university details, VC, faculty, departments, facilities, events..."
              className="flex-1 px-4 py-2.5 border rounded-xl outline-none bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              onClick={() => send()}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition flex items-center gap-1.5 shadow disabled:bg-slate-400"
            >
              <span>Ask</span>
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* 🔹 Dedicated Two Module Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {/* Module 1: Student Module */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-md hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                1. Student Complaint Management System
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                Students can lodge campus complaints by selecting category, incident date, time, location, and severity level (Level 1 to 4). Monitor real-time status and read official administrative action feedback.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-indigo-600 font-semibold">Student Portal</span>
              <button
                onClick={() => navigate("/login", { state: { initialTab: "student" } })}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                <span>Enter Complaint System</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Module 2: Admin Module */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-purple-100 shadow-md hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                2. Admin Complaints Evaluation Center
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                Campus administration review grievances, verify incident time/level, update resolution workflow (Pending ➔ Under Review ➔ Resolved), log work orders, and return official feedback to students.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-purple-600 font-semibold">Admin Portal</span>
              <button
                onClick={() => navigate("/login", { state: { initialTab: "admin" } })}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800"
              >
                <span>Enter Admin Center</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        Smart Campus Connect © 2026 • Developed by SPA • MERN Architecture & Dart/Flutter REST APIs
      </footer>
    </div>
  );
}

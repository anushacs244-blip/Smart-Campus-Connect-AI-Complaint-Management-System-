/**
 * CampusConnect AI - Chat Interface
 * Author: SPA
 */

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMoon, FiSun } from "react-icons/fi";
import { ShieldAlert, Bot } from "lucide-react";

export default function Chat({ role, setIsLoggedIn }) {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  const bottomRef = useRef(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

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
      setChat(prev => [...prev, { u: userMessage, b: "Error contacting server. Please make sure backend is running." }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  const quickPrompts = [
    "Tell me about the university",
    "Who is the Vice Chancellor?",
    "Who is HOD of CS?",
    "Show faculty members",
    "List upcoming events",
    "Library timing",
    "Latest notice"
  ];

  return (
    <div className="h-screen flex flex-col
                bg-gradient-to-br from-slate-50 to-indigo-100
                dark:from-slate-900 dark:to-slate-800
                text-slate-900 dark:text-slate-100">

      {/* 🔹 Navbar */}
      <div className="flex justify-between items-center px-4 md:px-8 py-3.5
                bg-white dark:bg-slate-900
                border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              CampusConnect AI
            </h2>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Smart Campus Assistant • Developed by SPA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Complaints button for all users */}
          <button
            onClick={() => navigate("/complaints")}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition shadow-sm"
            title="Lodge or View Student Complaints"
          >
            <ShieldAlert size={16} />
            <span>Complaints</span>
          </button>

          {role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition shadow-sm"
            >
              Admin Panel
            </button>
          )}

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition shadow-sm"
          >
            Logout
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border
             border-slate-300 dark:border-slate-700
             bg-white dark:bg-slate-800
             hover:bg-slate-100 dark:hover:bg-slate-700
             transition"
          >
            {darkMode ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>
        </div>
      </div>

      {/* 🔹 Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5 max-w-5xl mx-auto w-full">

        {chat.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bot size={36} />
            </div>
            <h3 className="text-xl font-bold mb-1">Welcome to Smart Campus Assistant</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Ask any question about university information, departments, faculty, events, facilities, notices, or grievance help!
            </p>

            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => send(q)}
                  className="text-xs px-3.5 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:border-indigo-400 text-slate-700 dark:text-slate-300 font-medium transition shadow-sm"
                >
                  💡 {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chat.map((c, i) => (
          <div key={i} className="space-y-3">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-indigo-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow max-w-[80%] md:max-w-[70%]">
                {c.u}
              </div>
            </div>

            {/* Bot Message */}
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800
                px-5 py-3.5 rounded-2xl rounded-tl-sm shadow max-w-[85%] md:max-w-[75%] border
                border-slate-200 dark:border-slate-700 whitespace-pre-line text-sm leading-relaxed">
                {c.b}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></span>
            AI Assistant is querying campus storage...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* 🔹 Input Area */}
      <div className="bg-white dark:bg-slate-900 border-t
                border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex gap-3">
          <input
            value={msg}
            onChange={e => setMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about university details, VC, faculty, events, facilities, complaints..."
            className="flex-1 px-4 py-3 border rounded-xl outline-none
               bg-slate-50 dark:bg-slate-800
               border-slate-300 dark:border-slate-700
               focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          <button
            onClick={() => send()}
            disabled={loading}
            className={`px-6 py-3 rounded-xl text-white font-semibold transition shadow-md
            ${loading
                ? "bg-slate-400"
                : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}


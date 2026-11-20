/**
 * CampusConnect AI - Student Grievance & Complaint Portal
 * Author: SPA
 */

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Home,
  LogOut,
  PlusCircle,
  ListFilter,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldAlert,
  Calendar,
  MapPin,
  MessageSquareQuote,
  Wrench,
  User
} from "lucide-react";

export default function StudentComplaints({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my"); // "my" or "raise"
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Infrastructure",
    complaintLevel: "Level 2 - Moderate",
    incidentDate: new Date().toISOString().split("T")[0],
    incidentTime: "10:30",
    location: "",
    description: ""
  });

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "Student";
  const userRoll = localStorage.getItem("userRoll") || "";

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/complaints/my", authHeader);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadComplaints();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRoll");
    if (setIsLoggedIn) setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.warning("Please fill in both title and description");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/api/complaints", form, authHeader);
      toast.success("Complaint submitted successfully! Administrative staff has been notified.");
      setForm({
        title: "",
        category: "Infrastructure",
        complaintLevel: "Level 2 - Moderate",
        incidentDate: new Date().toISOString().split("T")[0],
        incidentTime: "10:30",
        location: "",
        description: ""
      });
      setActiveTab("my");
      loadComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit grievance");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 size={13} /> Resolved
          </span>
        );
      case "In Progress":
      case "Under Review":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Clock size={13} /> {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle size={13} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <AlertCircle size={13} /> Pending Review
          </span>
        );
    }
  };

  const getLevelBadge = (level) => {
    if (level?.includes("Level 4") || level?.includes("Urgent")) {
      return <span className="text-xs px-2.5 py-1 rounded-md font-extrabold bg-red-100 text-red-800">🚨 {level}</span>;
    }
    if (level?.includes("Level 3") || level?.includes("High")) {
      return <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-orange-100 text-orange-800">⚠️ {level}</span>;
    }
    if (level?.includes("Level 2") || level?.includes("Moderate")) {
      return <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-yellow-100 text-yellow-800">⚡ {level}</span>;
    }
    return <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-slate-100 text-slate-700">ℹ️ {level}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-900 p-4 md:p-8">
      {/* 🔹 Top Header Bar */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-indigo-600" size={28} />
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Student Grievance & Complaint Portal
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <User size={13} /> Logged in as: <strong className="text-slate-700">{userName}</strong> {userRoll ? `(${userRoll})` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs md:text-sm transition border border-slate-200 shadow-sm"
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-xs md:text-sm transition shadow-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 🔹 Main Container */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
          <button
            onClick={() => setActiveTab("my")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition ${
              activeTab === "my"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ListFilter size={18} />
            My Complaints ({complaints.length})
          </button>

          <button
            onClick={() => setActiveTab("raise")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition ${
              activeTab === "raise"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <PlusCircle size={18} />
            Lodge New Complaint
          </button>
        </div>

        {/* 🔹 Tab 1: Raise Complaint Form */}
        {activeTab === "raise" && (
          <div className="p-6 md:p-10">
            <h2 className="text-xl font-bold mb-1">Submit a Grievance / Complaint</h2>
            <p className="text-xs text-slate-500 mb-6">
              Enter incident date, time, location, category, and severity level. Campus administrators evaluate and return written feedback.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Complaint Subject / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Water leakage in Hostel Block B washroom"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none bg-slate-50 border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl outline-none bg-slate-50 border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="Hostel">Hostel & Accommodation</option>
                    <option value="Academics">Academics & Classes</option>
                    <option value="Infrastructure">Infrastructure & Electricity</option>
                    <option value="Laboratory">Laboratory & Equipment</option>
                    <option value="Canteen">Canteen & Food Quality</option>
                    <option value="Library">Library & Reading Space</option>
                    <option value="Harassment/Ragging">Harassment / Anti-Ragging</option>
                    <option value="Other">Other Campus Grievances</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Complaint Level / Severity *
                  </label>
                  <select
                    value={form.complaintLevel}
                    onChange={(e) => setForm({ ...form, complaintLevel: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl outline-none bg-slate-50 border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                  >
                    <option value="Level 1 - Minor">Level 1 - Minor (Routine suggestion / cosmetic issue)</option>
                    <option value="Level 2 - Moderate">Level 2 - Moderate (Impacting daily comfort/activity)</option>
                    <option value="Level 3 - High">Level 3 - High (Impacting lectures, exams, or living conditions)</option>
                    <option value="Level 4 - Urgent / Emergency">Level 4 - Urgent / Emergency (Safety, power outage, health)</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Incident Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.incidentDate}
                    onChange={(e) => setForm({ ...form, incidentDate: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl outline-none bg-slate-50 border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Incident Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.incidentTime}
                    onChange={(e) => setForm({ ...form, incidentTime: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl outline-none bg-slate-50 border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Specific Location / Room *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Hostel Block B Room 304"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl outline-none bg-slate-50 border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Detailed Grievance Description *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Explain the grievance clearly, including when it started, who was affected, and any previous attempts to resolve it..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none bg-slate-50 border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto px-8 py-3.5 rounded-xl text-white font-bold bg-indigo-600 hover:bg-indigo-700 transition shadow-md disabled:bg-slate-400"
              >
                {submitting ? "Submitting..." : "Submit Complaint to Administration"}
              </button>
            </form>
          </div>
        )}

        {/* 🔹 Tab 2: My Complaints List */}
        {activeTab === "my" && (
          <div className="p-6 md:p-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">My Registered Complaints & Feedback</h2>
                <p className="text-xs text-slate-500">Track resolution progress and read official administrative responses</p>
              </div>
              <button
                onClick={loadComplaints}
                className="text-xs px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold transition"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 animate-pulse">
                Loading your complaints...
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                <AlertCircle size={44} className="mx-auto text-slate-400 mb-3" />
                <p className="text-lg font-bold text-slate-700">No complaints registered yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-5">Have an issue on campus? Lodge a grievance to get it resolved quickly.</p>
                <button
                  onClick={() => setActiveTab("raise")}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow"
                >
                  Lodge Your First Complaint
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {complaints.map((item) => (
                  <div
                    key={item._id}
                    className="p-6 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition"
                  >
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(item.status)}
                        {getLevelBadge(item.complaintLevel)}
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar size={13} />
                        <span>Incident: {item.incidentDate} at {item.incidentTime}</span>
                      </div>
                    </div>

                    {/* Complaint Title & Location */}
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                      <MapPin size={13} />
                      <span>{item.location || "Campus"}</span>
                    </p>

                    {/* Description */}
                    <p className="text-sm text-slate-700 leading-relaxed mb-4 bg-white p-4 rounded-xl border border-slate-200">
                      {item.description}
                    </p>

                    {/* 🔹 Admin Feedback & Evaluation Box */}
                    {item.adminFeedback ? (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquareQuote size={18} className="text-emerald-700" />
                          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                            Admin Evaluation & Feedback:
                          </span>
                          {item.evaluatedBy && (
                            <span className="text-xs font-semibold text-slate-600 ml-auto">
                              Evaluated by: {item.evaluatedBy} ({item.evaluatedAt || "Recently"})
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-slate-800 font-medium pl-6 mb-2">
                          "{item.adminFeedback}"
                        </p>

                        {item.actionTaken && (
                          <div className="pl-6 pt-2 border-t border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                            <Wrench size={14} />
                            <span>Action Taken: {item.actionTaken}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2 font-medium">
                        <Clock size={16} />
                        Your complaint has been logged and assigned to administrative evaluation. Feedback will appear here once reviewed.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * CampusConnect AI - Manage Student Complaints Component (Admin)
 * Author: SPA
 */

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Send,
  Calendar,
  MapPin,
  User,
  MessageSquareQuote,
  Wrench,
  ShieldAlert
} from "lucide-react";

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Evaluation Form State
  const [evalStatus, setEvalStatus] = useState("Under Review");
  const [evalFeedback, setEvalFeedback] = useState("");
  const [evalAction, setEvalAction] = useState("");
  const [saving, setSaving] = useState(false);

  const token = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/complaints", token);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleStartEvaluate = (item) => {
    setEditingId(item._id);
    setEvalStatus(item.status || "Under Review");
    setEvalFeedback(item.adminFeedback || "");
    setEvalAction(item.actionTaken || "");
  };

  const handleSaveEvaluation = async (id) => {
    if (!evalFeedback.trim()) {
      toast.warning("Please provide administrative feedback to return to the student.");
      return;
    }

    setSaving(true);
    try {
      await axios.put(`/api/complaints/${id}/evaluate`, {
        status: evalStatus,
        adminFeedback: evalFeedback,
        actionTaken: evalAction
      }, token);

      toast.success("Complaint evaluated & feedback returned to student!");
      setEditingId(null);
      loadComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Evaluation update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint record?")) return;
    try {
      await axios.delete(`/api/complaints/${id}`, token);
      toast.success("Complaint deleted");
      loadComplaints();
    } catch (err) {
      toast.error("Failed to delete complaint");
    }
  };

  const filtered = complaints.filter(c => {
    if (filter === "All") return true;
    return c.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 size={13} /> Resolved
          </span>
        );
      case "In Progress":
      case "Under Review":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Clock size={13} /> {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            <XCircle size={13} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertCircle size={13} /> Pending
          </span>
        );
    }
  };

  const getLevelBadge = (level) => {
    if (level?.includes("Level 4") || level?.includes("Urgent")) {
      return <span className="text-xs px-2.5 py-0.5 rounded font-extrabold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">🚨 {level}</span>;
    }
    if (level?.includes("Level 3") || level?.includes("High")) {
      return <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">⚠️ {level}</span>;
    }
    return <span className="text-xs px-2.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{level}</span>;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h3 className="text-xl font-bold">Student Complaints Evaluation Center</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin Module • Review grievances with date/time, assess severity, update status, and return feedback to students
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Under Review", "In Progress", "Resolved", "Rejected"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition ${
                filter === s
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Loading student complaints...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 text-slate-400 border border-dashed rounded-2xl">
          No complaints found under filter: {filter}
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map(item => (
            <div
              key={item._id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm hover:shadow-md transition"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge(item.status)}
                  {getLevelBadge(item.complaintLevel)}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-semibold">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>Incident: {item.incidentDate} at {item.incidentTime}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Title & Student Meta */}
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                {item.title}
              </h4>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                  <User size={13} /> {item.studentName} ({item.studentRoll || "Student"})
                </span>
                <span>•</span>
                <span>Email: {item.studentEmail}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> Location: {item.location || "Campus"}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                {item.description}
              </p>

              {/* Current Feedback if already evaluated */}
              {item.adminFeedback && editingId !== item._id && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquareQuote size={15} className="text-emerald-700 dark:text-emerald-400" />
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      Feedback Returned to Student:
                    </span>
                    {item.evaluatedBy && (
                      <span className="text-slate-500 ml-auto">
                        Evaluated by: {item.evaluatedBy} ({item.evaluatedAt || "Recently"})
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 font-medium pl-5 mb-1.5 text-sm">
                    "{item.adminFeedback}"
                  </p>
                  {item.actionTaken && (
                    <p className="pl-5 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                      <Wrench size={13} /> Action Taken: {item.actionTaken}
                    </p>
                  )}
                </div>
              )}

              {/* Evaluation Action Box */}
              {editingId === item._id ? (
                <div className="mt-4 p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-4 shadow-inner">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs uppercase tracking-wider">
                    <ShieldAlert size={16} />
                    <span>Evaluate Complaint & Return Student Feedback</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">Update Status *</label>
                      <select
                        value={evalStatus}
                        onChange={(e) => setEvalStatus(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border rounded-xl outline-none bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-semibold"
                      >
                        <option value="Pending">Pending Review</option>
                        <option value="Under Review">Under Review</option>
                        <option value="In Progress">In Progress (Work Assigned)</option>
                        <option value="Resolved">Resolved (Completed)</option>
                        <option value="Rejected">Rejected (Invalid/Duplicate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">Action Taken (Work Order / Physical Step)</label>
                      <input
                        type="text"
                        placeholder="e.g., Electrician assigned (Work order #402), parts replaced"
                        value={evalAction}
                        onChange={(e) => setEvalAction(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border rounded-xl outline-none bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Feedback Returned to Student * (Student will see this message directly)
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g., We inspected your complaint regarding the washroom leakage. Maintenance team has repaired the valve and confirmed it is working. Thank you for notifying us."
                      value={evalFeedback}
                      onChange={(e) => setEvalFeedback(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border rounded-xl outline-none bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    ></textarea>
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={saving}
                      onClick={() => handleSaveEvaluation(item._id)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    >
                      <Send size={13} />
                      {saving ? "Submitting..." : "Submit Evaluation & Send Feedback"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleStartEvaluate(item)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow"
                  >
                    <MessageSquareQuote size={14} />
                    <span>Evaluate & Return Feedback</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * CampusConnect AI - Multi-Role Registration Portal
 * Author: SPA
 */

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GraduationCap, ShieldCheck, UserPlus, ArrowLeft } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState("student"); // "student" or "admin"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    department: "Computer Engineering"
  });

  // Admin Form State
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    adminCode: "",
    department: "Campus Administration"
  });

  const handleStudentRegister = async (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email || !studentForm.password) {
      toast.warning("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/register/student", studentForm);
      toast.success("Student account created successfully! Please log in.");
      navigate("/login", {
        state: { email: studentForm.email, initialTab: "student" }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Student registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.email || !adminForm.password || !adminForm.adminCode) {
      toast.warning("Please fill all required fields including Admin Passcode");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/register/admin", adminForm);
      toast.success("Admin account created successfully! Please log in.");
      navigate("/login", {
        state: { email: adminForm.email, initialTab: "admin" }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4 py-12">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl p-6 md:p-10 border border-slate-200">

        {/* Back to Home Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-2">
            <UserPlus size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">
            Create an Account
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Choose your role to register for the appropriate campus portal
          </p>
        </div>

        {/* 🔹 Role Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRoleTab("student")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs md:text-sm transition ${
              roleTab === "student"
                ? "bg-white text-indigo-600 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap size={18} />
            Student Registration
          </button>

          <button
            type="button"
            onClick={() => setRoleTab("admin")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs md:text-sm transition ${
              roleTab === "admin"
                ? "bg-white text-purple-600 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck size={18} />
            Admin Registration
          </button>
        </div>

        {/* 🔹 Tab 1: Student Registration */}
        {roleTab === "student" && (
          <form onSubmit={handleStudentRegister} className="space-y-4">
            <div className="bg-indigo-50/80 p-3 rounded-xl text-xs text-indigo-800 font-medium border border-indigo-100">
              🎓 <strong>Student Grievance Portal:</strong> Submit campus complaints with date, time, location, and severity level, and track administrative action feedback.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                required
                type="text"
                placeholder="e.g., Rahul Verma"
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Roll / ID No.</label>
                <input
                  type="text"
                  placeholder="e.g., CS-2024-042"
                  value={studentForm.rollNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={studentForm.department}
                  onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm text-slate-700"
                >
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics Engineering">Electronics Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Applied Sciences">Applied Sciences</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                required
                type="email"
                placeholder="student@campus.edu"
                value={studentForm.email}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md disabled:bg-slate-400 mt-2"
            >
              {loading ? "Registering..." : "Complete Student Registration"}
            </button>
          </form>
        )}

        {/* 🔹 Tab 2: Admin Registration */}
        {roleTab === "admin" && (
          <form onSubmit={handleAdminRegister} className="space-y-4">
            <div className="bg-purple-50 p-3 rounded-xl text-xs text-purple-700 font-medium border border-purple-100">
              🛡️ <strong>Administrative Evaluation Center:</strong> Evaluate grievances, assign work orders, update complaint status, and return feedback to students.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Administrator Full Name</label>
              <input
                required
                type="text"
                placeholder="e.g., Dr. S. P. Sharma"
                value={adminForm.name}
                onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="admin@campusconnect.com"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Passcode <span className="text-purple-600 font-bold">(ADMIN2026)</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter ADMIN2026"
                  value={adminForm.adminCode}
                  onChange={(e) => setAdminForm({ ...adminForm, adminCode: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Office</label>
              <input
                type="text"
                placeholder="e.g., Campus Maintenance, Examination Cell, Student Welfare"
                value={adminForm.department}
                onChange={(e) => setAdminForm({ ...adminForm, department: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Create admin password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition shadow-md disabled:bg-slate-400 mt-2"
            >
              {loading ? "Verifying..." : "Complete Admin Registration"}
            </button>
          </form>
        )}

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-600 mt-6 pt-4 border-t border-slate-200">
          Already registered?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-bold hover:underline"
          >
            Log in to Portal
          </button>
        </p>

      </div>
    </div>
  );
}

/**
 * CampusConnect AI - Multi-Role Login Portal
 * Author: SPA
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GraduationCap, ShieldCheck, LogIn, ArrowLeft } from "lucide-react";

export default function Login({ setIsLoggedIn, setRole }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("student"); // "student" or "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.initialTab) {
      setActiveTab(location.state.initialTab);
    }
  }, [location.state]);

  const handleFillDemo = (type, customEmail) => {
    if (type === "student") {
      setActiveTab("student");
      setEmail(customEmail || "student@campus.edu");
      setPassword("admin123");
    } else {
      setActiveTab("admin");
      setEmail("spa@campusconnect.com");
      setPassword("admin123");
    }
  };

  const login = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      toast.warning("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userName", res.data.name || "");
      localStorage.setItem("userEmail", res.data.email || "");
      localStorage.setItem("userRoll", res.data.rollNumber || "");

      setIsLoggedIn(true);
      setRole(res.data.role);

      toast.success(`Welcome, ${res.data.name || "User"}!`);

      // Student enters Student Complaints Portal directly; Admin enters Admin Center directly!
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/complaints");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4 py-12">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl p-6 md:p-8 border border-slate-200">

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
            <LogIn size={26} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            Sign in to Portal
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            {activeTab === "student"
              ? "Student Grievance & Complaint Redressal System"
              : "Administrative Complaints Evaluation Center"}
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab("student");
              if (email === "spa@campusconnect.com") setEmail("");
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs md:text-sm transition ${
              activeTab === "student"
                ? "bg-white text-indigo-600 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap size={16} />
            Student Login
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("admin");
              if (email === "student@campus.edu") setEmail("");
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs md:text-sm transition ${
              activeTab === "admin"
                ? "bg-white text-purple-600 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck size={16} />
            Admin Login
          </button>
        </div>

        {/* Quick Demo Pill */}
        <div className="mb-5 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs space-y-1.5">
          <div className="flex justify-between items-center text-slate-500 font-semibold">
            <span>Demo Accounts:</span>
            {activeTab === "admin" && (
              <button
                type="button"
                onClick={() => handleFillDemo("admin")}
                className="font-bold text-purple-600 hover:text-purple-800 underline"
              >
                Fill Admin Demo
              </button>
            )}
          </div>
          {activeTab === "student" && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleFillDemo("student", "student@campus.edu")}
                className="px-2 py-1 rounded-md bg-white border border-slate-200 text-indigo-700 font-bold hover:bg-indigo-50"
              >
                Preetham H K
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("student", "spandana@campus.edu")}
                className="px-2 py-1 rounded-md bg-white border border-slate-200 text-indigo-700 font-bold hover:bg-indigo-50"
              >
                Spandana M A
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("student", "anusha@campus.edu")}
                className="px-2 py-1 rounded-md bg-white border border-slate-200 text-indigo-700 font-bold hover:bg-indigo-50"
              >
                Anusha C S
              </button>
            </div>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {activeTab === "student" ? "Student Email" : "Admin Email"}
            </label>
            <input
              required
              type="email"
              placeholder={activeTab === "student" ? "student@campus.edu" : "spa@campusconnect.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            className={`w-full py-3.5 rounded-xl font-bold text-white transition shadow-md disabled:bg-slate-400 mt-2 ${
              activeTab === "student"
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Authenticating..." : `Sign in as ${activeTab === "student" ? "Student" : "Administrator"}`}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-slate-600 mt-6 pt-4 border-t border-slate-200">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-bold hover:underline"
          >
            Register Here
          </button>
        </p>

      </div>
    </div>
  );
}

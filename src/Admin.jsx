/**
 * CampusConnect AI - Admin Dashboard
 * Author: SPA
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEvent from "./admin/AddEvent";
import AddDepartment from "./admin/AddDepartment";
import AddFaculty from "./admin/AddFaculty";
import AddFacility from "./admin/AddFacility";
import AddNotice from "./admin/AddNotice";
import ManageComplaints from "./admin/ManageComplaints";
import ManageUniversity from "./admin/ManageUniversity";
import { toast } from "react-toastify";
import { Home, LogOut } from "lucide-react";

export default function Admin({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("complaints");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRoll");
    if (setIsLoggedIn) setIsLoggedIn(false);
    toast.success("Logged out successfully 👋");
    navigate("/");
  };

  const tabs = [
    { id: "complaints", label: "Student Complaints", icon: "⚠️" },
    { id: "university", label: "University Profile", icon: "🏛️" },
    { id: "departments", label: "Departments", icon: "🏢" },
    { id: "faculty", label: "Faculty", icon: "👨‍🏫" },
    { id: "events", label: "Events", icon: "📅" },
    { id: "facilities", label: "Facilities", icon: "🏛️" },
    { id: "notices", label: "Notices", icon: "📢" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-4 md:p-8 text-slate-900">

      {/* 🔹 Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Administrative Control Center
          </h2>
          <p className="text-xs text-indigo-600 font-semibold mt-1">
            Smart Campus Connect • Developed by SPA
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
             bg-white hover:bg-slate-100
             text-slate-700 font-semibold text-xs md:text-sm transition border border-slate-200 shadow-sm"
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
                     bg-red-500 hover:bg-red-600
                     text-white font-semibold text-xs md:text-sm transition shadow-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2
  ${activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : `bg-white
         text-slate-600
         hover:bg-slate-100 border border-slate-200`
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 🔹 Content Card */}
      <div className="bg-white shadow-xl rounded-3xl p-6 md:p-8 border border-slate-200">
        {activeTab === "complaints" && <ManageComplaints />}
        {activeTab === "university" && <ManageUniversity />}
        {activeTab === "events" && <AddEvent />}
        {activeTab === "departments" && <AddDepartment />}
        {activeTab === "faculty" && <AddFaculty />}
        {activeTab === "facilities" && <AddFacility />}
        {activeTab === "notices" && <AddNotice />}
      </div>

    </div>
  );
}

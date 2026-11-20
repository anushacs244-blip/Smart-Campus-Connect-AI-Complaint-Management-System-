/**
 * CampusConnect AI - Main Application Router
 * Author: SPA
 */

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./auth/Register";
import Admin from "./Admin";
import Login from "./auth/Login";
import GetStarted from "./GetStarted";
import StudentComplaints from "./complaints/StudentComplaints";
import logo from "./assets/logo2.png";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const link =
      document.querySelector("link[rel~='icon']") ||
      document.createElement("link");

    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = logo;

    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(savedRole);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Main Interface (AI Conversation Assistant + Portals) */}
        <Route path="/" element={<GetStarted />} />

        {/* ✅ Login Page */}
        <Route
          path="/login"
          element={
            isLoggedIn
              ? (role === "admin" ? <Navigate to="/admin" /> : <Navigate to="/complaints" />)
              : <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
          }
        />

        {/* ✅ Register Page */}
        <Route path="/register" element={<Register />} />

        {/* ✅ Student Grievance & Complaint Portal (Student Only) */}
        <Route
          path="/complaints"
          element={
            isLoggedIn
              ? <StudentComplaints setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/login" />
          }
        />

        {/* ✅ Admin Complaints Evaluation Center (Admin Only) */}
        <Route
          path="/admin"
          element={
            isLoggedIn && role === "admin"
              ? <Admin setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/login" />
          }
        />

        {/* Redirect /chat to Main Interface */}
        <Route path="/chat" element={<Navigate to="/" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} />
    </Router>
  );
}

export default App;

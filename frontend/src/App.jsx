import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import TimetablePage from "./pages/TimetablePage";
import AttendancePage from "./pages/AttendancePage";
import ReportPage from "./pages/ReportPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
3

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in (i.e., if studentId is in localStorage)
  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    if (studentId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    // Clear the studentId from localStorage and update state
    localStorage.removeItem("studentId");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <nav style={{ marginBottom: "2rem" }}>
          {/* Show navigation links based on login status */}
          {!isLoggedIn ? (
            <>
              <Link to="/login" style={{ marginRight: "10px" }}>🔐 Login</Link>
              <Link to="/register" style={{ marginRight: "10px" }}>🆕 Register</Link>
            </>
          ) : (
            <>
              <Link to="/timetable" style={{ marginRight: "10px" }}>🗓️ Timetable</Link>
              <Link to="/attendance" style={{ marginRight: "10px" }}>✅ Attendance</Link>
              <Link to="/report" style={{ marginRight: "10px" }}>📊 Report</Link>
              {/* Add logout button */}
              <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
                🚪 Logout
              </button>
            </>
          )}
        </nav>

        <Routes>
          {/* Show login and register pages only when not logged in */}
          {!isLoggedIn ? (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Redirect to login by default if the user is not logged in */}
              <Route path="/" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              {/* Show Timetable, Attendance, and Report pages after login */}
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/report" element={<ReportPage />} />
              {/* Redirect to timetable if the user is already logged in */}
              <Route path="/" element={<Navigate to="/timetable" />} />
            </>
          )}

          {/* Catch-all redirect to login page if the user is not logged in */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

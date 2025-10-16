import React, { useState, useEffect } from "react";
import axios from "axios";

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const studentId = localStorage.getItem("studentId");

function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState([]);
  const [timetable, setTimetable] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/timetable/${studentId}`).then((res) => {
      if (res.data?.timetable) setTimetable(res.data.timetable);
    });
  }, []);

  useEffect(() => {
    const weekday = days[new Date(selectedDate).getDay()];
    const todaySubjects = timetable[weekday] || [];
    const attData = todaySubjects.map((subject, i) => ({
      hour: i + 1,
      subject,
      status: "Absent",
    }));
    setAttendance(attData);
  }, [selectedDate, timetable]);

  const toggleStatus = (index) => {
    const updated = [...attendance];
    updated[index].status = updated[index].status === "Present" ? "Absent" : "Present";
    setAttendance(updated);
  };

  const submitAttendance = async () => {
    try {
      await axios.post("http://localhost:5000/mark-attendance", {
        studentId,
        date: selectedDate,
        dailyAttendance: attendance,
      });
      alert("Attendance saved");
    } catch (error) {
      alert("Error submitting attendance");
    }
  };

  return (
    <div>
      <h2>✅ Mark Attendance</h2>
      <label>
        Select Date:{" "}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </label>

      {attendance.length > 0 ? (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Hour</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Toggle</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((item, index) => (
              <tr key={index}>
                <td>{item.hour}</td>
                <td>{item.subject}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => toggleStatus(index)}>Toggle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No timetable found for this day.</p>
      )}
      <button onClick={submitAttendance} style={{ marginTop: "10px" }}>
        Submit Attendance
      </button>
    </div>
  );
}

export default AttendancePage;

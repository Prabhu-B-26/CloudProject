import React, { useState, useEffect } from "react";
import axios from "axios";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const studentId = localStorage.getItem("studentId");

function TimetablePage() {
  const [timetable, setTimetable] = useState(
    days.reduce((acc, day) => ({ ...acc, [day]: Array(8).fill("") }), {})
  );

  useEffect(() => {
    axios.get(`http://localhost:5000/timetable/${studentId}`).then((res) => {
      if (res.data?.timetable) setTimetable(res.data.timetable);
    });
  }, []);

  const handleTimetableChange = (day, hour, value) => {
    const updated = { ...timetable };
    updated[day][hour] = value;
    setTimetable(updated);
  };

  const saveTimetable = async () => {
    try {
      await axios.post("http://localhost:5000/timetable", {
        studentId,
        timetable,
      });
      alert("Timetable saved");
    } catch {
      alert("Error saving timetable");
    }
  };

  return (
    <div>
      <h2>🗓️ Set Weekly Timetable</h2>
      {days.map((day) => (
        <div key={day}>
          <h4>{day.toUpperCase()}</h4>
          {timetable[day].map((subject, hour) => (
            <input
              key={hour}
              type="text"
              placeholder={`Hour ${hour + 1}`}
              value={subject}
              onChange={(e) => handleTimetableChange(day, hour, e.target.value)}
              style={{ marginRight: "6px", marginBottom: "4px" }}
            />
          ))}
        </div>
      ))}
      <button style={{ marginTop: "10px" }} onClick={saveTimetable}>
        Save Timetable
      </button>
    </div>
  );
}

export default TimetablePage;

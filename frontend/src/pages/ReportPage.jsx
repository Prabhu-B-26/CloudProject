import React, { useState, useEffect } from "react";
import axios from "axios";

const studentId = localStorage.getItem("studentId");

function ReportPage() {
  const [report, setReport] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/report/${studentId}`)
      .then((res) => setReport(res.data))
      .catch(() => alert("Error loading report"));
  }, []);

  return (
    <div>
      <h2>📊 Attendance Report</h2>
      {report.length > 0 ? (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Present</th>
              <th>Total</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {report.map((item) => (
              <tr key={item.subject}>
                <td>{item.subject}</td>
                <td>{item.present}</td>
                <td>{item.total}</td>
                <td>{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance data available.</p>
      )}
    </div>
  );
}

export default ReportPage;

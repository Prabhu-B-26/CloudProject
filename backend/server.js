const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000";

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB error:"));
db.once("open", () => console.log("MongoDB connected ✅"));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  date: String,
  dailyAttendance: [
    {
      hour: Number,
      subject: String,
      status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
    },
  ],
});
const Attendance = mongoose.model("Attendance", attendanceSchema);

// Timetable Schema
const timetableSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  timetable: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String],
  },
});
const Timetable = mongoose.model("Timetable", timetableSchema);

// User Registration
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body); // Log the request body for debugging
    try {
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      res.json({ message: "User registered successfully", user });
    } catch (err) {
      console.error("Error registering user:", err);
      res.status(400).json({ message: "Registration failed", error: err.message });
    }
  });
  
  app.get('/', (req, res) => {
  res.send('Backend is working!');
});


// User Login
app.post("/login", async (req, res) => {
    console.log(req.body);  // Add this line to log the received data
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ message: "Invalid username or password" });
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: "Invalid username or password" });
  
      res.json({ message: "Login successful", user });
    } catch (err) {
      res.status(500).json({ message: "Login error", error: err.message });
    }
  });
  

// Mark Attendance
app.post("/mark-attendance", async (req, res) => {
  const { studentId, date, dailyAttendance } = req.body;
  if (!studentId || !date || !dailyAttendance) {
    return res.status(400).json({ message: "Missing fields" });
  }
  try {
    await Attendance.findOneAndDelete({ studentId, date });
    const attendance = new Attendance({ studentId, date, dailyAttendance });
    await attendance.save();
    res.status(200).json({ message: "Attendance saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Attendance for a Day
app.get("/attendance/:studentId/:date", async (req, res) => {
  try {
    const { studentId, date } = req.params;
    const attendance = await Attendance.findOne({ studentId, date });

    if (attendance) {
      res.json(attendance);
    } else {
      res.status(404).send("No attendance found for this date");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching attendance");
  }
});

// Save Timetable
app.post("/timetable", async (req, res) => {
  const { studentId, timetable } = req.body;
  if (!studentId || !timetable) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const updated = await Timetable.findOneAndUpdate(
      { studentId },
      { timetable },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Timetable saved", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Error saving timetable" });
  }
});

// Get Timetable
app.get("/timetable/:studentId", async (req, res) => {
  try {
    const result = await Timetable.findOne({ studentId: req.params.studentId });
    res.status(200).json(result || {});
  } catch (err) {
    res.status(500).json({ message: "Error fetching timetable" });
  }
});

// Attendance Report
app.get("/report/:studentId", async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.params.studentId });

    const subjectStats = {};

    records.forEach((record) => {
      record.dailyAttendance.forEach((entry) => {
        const { subject, status } = entry;
        if (!subject) return;
        if (!subjectStats[subject]) {
          subjectStats[subject] = { total: 0, present: 0 };
        }
        subjectStats[subject].total += 1;
        if (status === "Present") {
          subjectStats[subject].present += 1;
        }
      });
    });

    const report = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      total: stats.total,
      present: stats.present,
      percentage: ((stats.present / stats.total) * 100).toFixed(2),
    }));

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating report" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

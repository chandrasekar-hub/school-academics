const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/schoolDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => {
  console.log("MongoDB connection failed. Running in mock mode.");
  console.log("Error:", err.message);
});

// In-memory storage for marks, attendance, and performance
let marks = [];
let attendance = [];
let performance = [];
let markId = 1;
let attendanceId = 1;
let performanceId = 1;

// Sample students data
let students = [
  { id: 1, name: "Aarav Kumar", rollNo: "001", className: "10A" },
  { id: 2, name: "Ananya Sharma", rollNo: "002", className: "10A" },
  { id: 3, name: "Arjun Singh", rollNo: "003", className: "10B" },
  { id: 4, name: "Diya Patel", rollNo: "004", className: "10B" },
  { id: 5, name: "Rohan Gupta", rollNo: "005", className: "10C" }
];
let studentId = 6;

// Students endpoints
app.get("/students", (req, res) => {
  res.json(students);
});

app.post("/students", (req, res) => {
  const { name, rollNo, className } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  const newStudent = { id: studentId++, name, rollNo: rollNo || "", className: className || "" };
  students.push(newStudent);
  res.json(newStudent);
});

// Marks endpoints
app.get("/marks", (req, res) => {
  const marksWithNames = marks.map(m => ({
    ...m,
    studentName: students.find(s => s.id == m.studentId)?.name || "Unknown"
  }));
  res.json(marksWithNames);
});

app.post("/marks", (req, res) => {
  const { studentId, subject, marks: marksValue } = req.body;
  const studentName = students.find(s => s.id == studentId)?.name || "Unknown";
  const newMark = { id: markId++, studentId, subject, marks: marksValue, studentName };
  marks.push(newMark);
  res.json(newMark);
});

app.put("/marks/:id", (req, res) => {
  const { studentId, subject, marks: marksValue } = req.body;
  const mark = marks.find(m => m.id == req.params.id);
  if (mark) {
    mark.studentId = studentId;
    mark.subject = subject;
    mark.marks = marksValue;
    mark.studentName = students.find(s => s.id == studentId)?.name || "Unknown";
  }
  res.json(mark);
});

app.delete("/marks/:id", (req, res) => {
  marks = marks.filter(m => m.id != req.params.id);
  res.json({ message: "Deleted" });
});

// Attendance endpoints
app.get("/attendance", (req, res) => {
  const attendanceWithNames = attendance.map(a => ({
    ...a,
    studentName: students.find(s => s.id == a.studentId)?.name || "Unknown"
  }));
  res.json(attendanceWithNames);
});

app.post("/attendance", (req, res) => {
  const { studentId, date, status } = req.body;
  const studentName = students.find(s => s.id == studentId)?.name || "Unknown";
  const newAttendance = { id: attendanceId++, studentId, date, status, studentName };
  attendance.push(newAttendance);
  res.json(newAttendance);
});

app.put("/attendance/:id", (req, res) => {
  const { studentId, date, status } = req.body;
  const att = attendance.find(a => a.id == req.params.id);
  if (att) {
    att.studentId = studentId;
    att.date = date;
    att.status = status;
    att.studentName = students.find(s => s.id == studentId)?.name || "Unknown";
  }
  res.json(att);
});

app.delete("/attendance/:id", (req, res) => {
  attendance = attendance.filter(a => a.id != req.params.id);
  res.json({ message: "Deleted" });
});

// Performance endpoints
app.get("/performance", (req, res) => {
  const performanceWithNames = performance.map(p => ({
    ...p,
    studentName: students.find(s => s.id == p.studentId)?.name || "Unknown"
  }));
  res.json(performanceWithNames);
});

app.post("/performance", (req, res) => {
  const { studentId, academicScore, behaviorScore, remarks } = req.body;
  const studentName = students.find(s => s.id == studentId)?.name || "Unknown";
  const newPerformance = { id: performanceId++, studentId, academicScore, behaviorScore, remarks, studentName };
  performance.push(newPerformance);
  res.json(newPerformance);
});

app.put("/performance/:id", (req, res) => {
  const { studentId, academicScore, behaviorScore, remarks } = req.body;
  const perf = performance.find(p => p.id == req.params.id);
  if (perf) {
    perf.studentId = studentId;
    perf.academicScore = academicScore;
    perf.behaviorScore = behaviorScore;
    perf.remarks = remarks;
    perf.studentName = students.find(s => s.id == studentId)?.name || "Unknown";
  }
  res.json(perf);
});

app.delete("/performance/:id", (req, res) => {
  performance = performance.filter(p => p.id != req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

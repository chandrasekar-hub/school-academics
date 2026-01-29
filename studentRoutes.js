const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// Add Student
router.post("/", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.send(student);
});

// Get Students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

module.exports = router;

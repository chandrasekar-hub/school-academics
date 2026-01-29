const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  className: String
});

// In-memory storage fallback
let inMemoryStudents = [];
let nextId = 1;

const studentModel = mongoose.model("Student", studentSchema);

// Wrap the model to use in-memory storage if MongoDB fails
const Student = function(data) {
  this.id = nextId++;
  this.name = data.name;
  this.rollNo = data.rollNo;
  this.className = data.className;
};

Student.find = async function() {
  return inMemoryStudents;
};

Student.prototype.save = async function() {
  inMemoryStudents.push(this);
  return this;
};

module.exports = Student;
    
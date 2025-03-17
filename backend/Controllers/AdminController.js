const Admin = require('../Models/Admin');
const Prof = require('../Models/Prof');
const Eleve = require('../Models/Eleve');
const Class = require('../Models/Class');
const Cours = require('../Models/Cours');
const Planning = require('../Models/Planning');


// Admin Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = new Admin({ name, email, password });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error });
  }
};

// Admin Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Manage Teachers
exports.addTeacher = async (req, res) => {
  try {
    const newTeacher = new Prof(req.body);
    await newTeacher.save();
    res.status(201).json({ message: 'Teacher added successfully', newTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Error adding teacher', error });
  }
};

exports.removeTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    await Prof.findByIdAndDelete(id);
    res.status(200).json({ message: 'Teacher removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing teacher', error });
  }
};

exports.modifyTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTeacher = await Prof.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Teacher updated successfully', updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Error updating teacher', error });
  }
};

// Manage Students
exports.addStudent = async (req, res) => {
  try {
    const newStudent = new Eleve(req.body);
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error });
  }
};

exports.removeStudent = async (req, res) => {
  const { id } = req.params;

  try {
    await Eleve.findByIdAndDelete(id);
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing student', error });
  }
};

exports.modifyStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedStudent = await Eleve.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Student updated successfully', updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
};

// Manage Classes
exports.addClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json({ message: 'Class added successfully', newClass });
  } catch (error) {
    res.status(500).json({ message: 'Error adding class', error });
  }
};

exports.removeClass = async (req, res) => {
  const { id } = req.params;

  try {
    await Class.findByIdAndDelete(id);
    res.status(200).json({ message: 'Class removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing class', error });
  }
};

exports.modifyClass = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedClass = await Class.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Class updated successfully', updatedClass });
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error });
  }
};

// Manage Courses (Cours)
exports.addCourse = async (req, res) => {
  try {
    const newCourse = new Cours(req.body);
    await newCourse.save();
    res.status(201).json({ message: 'Course added successfully', newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error });
  }
};

exports.removeCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await Cours.findByIdAndDelete(id);
    res.status(200).json({ message: 'Course removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing course', error });
  }
};

exports.modifyCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCourse = await Cours.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Course updated successfully', updatedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error });
  }
};

// Admin can view a student's calendar
exports.getStudentCalendar = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student and their class
    const student = await Eleve.findById(studentId).populate("class");
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Find courses associated with the student's class
    const courses = await Cours.find({ class: student.class._id })
      .populate("matiere", "name") // Populate subject details
      .populate("enseignant", "name"); // Populate teacher details

    res.status(200).json({ student: student.name, calendar: courses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving student calendar", error: error.message });
  }
};

// NEW: Admin assigns an existing student to a class
exports.assignStudentToClass = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ message: 'Missing required fields: studentId and classId' });
    }

    // Find the student
    const student = await Eleve.findById(studentId);
    if (!student) {
      return res.status(400).json({ message: 'Student not found' });
    }

    // Find the class
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(400).json({ message: 'Class not found' });
    }

    // Check if the student is already in the class
    if (classDoc.eleves.includes(studentId)) {
      return res.status(400).json({ message: 'Student is already assigned to this class' });
    }

    // Add the student to the class and update the student's class field
    classDoc.eleves.push(studentId);
    await classDoc.save();

    student.class = classId;
    await student.save();

    res.status(200).json({ message: 'Student assigned to class successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

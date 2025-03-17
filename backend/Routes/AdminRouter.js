const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/AdminController');

// Admin Registration
router.post('/register', AdminController.register);

// Admin Login
router.post('/login', AdminController.login);

// Manage Teachers
router.post('/teachers', AdminController.addTeacher); // Add a teacher
router.delete('/teachers/:id', AdminController.removeTeacher); // Remove a teacher
router.put('/teachers/:id', AdminController.modifyTeacher); // Modify a teacher

// Manage Students
router.post('/students', AdminController.addStudent); // Add a student
router.delete('/students/:id', AdminController.removeStudent); // Remove a student
router.put('/students/:id', AdminController.modifyStudent); // Modify a student

// Manage Classes
router.post('/classes', AdminController.addClass); // Add a class
router.delete('/classes/:id', AdminController.removeClass); // Remove a class
router.put('/classes/:id', AdminController.modifyClass); // Modify a class

// Manage Courses (Cours)
router.post('/courses', AdminController.addCourse); // Add a course
router.delete('/courses/:id', AdminController.removeCourse); // Remove a course
router.put('/courses/:id', AdminController.modifyCourse); // Modify a course

//router.get('/students/:studentId/calendar', AdminController.getStudentCalendar);
router.put('/assign-student', AdminController.assignStudentToClass);

// Planning Endpoints
// e.g., GET all planned courses, POST new planned course
// (Renamed to /planning/courses and /planning/course to differentiate from normal courses)


module.exports = router;

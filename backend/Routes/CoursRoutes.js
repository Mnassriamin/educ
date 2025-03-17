const express = require('express');
const router = express.Router();
const coursController = require('../Controllers/CoursController');
const verifyToken = require('../Middlewares/Auth.js');

// Create a course
router.post('/', verifyToken, coursController.createCours);

// Get all courses
router.get('/', verifyToken, coursController.getAllCours);

// Delete a course by id
router.delete('/:id', verifyToken, coursController.deleteCours);

// Get all matieres (if needed)
router.get('/matieres', coursController.getAllMatieres);

// Get all profs (if needed)
router.get('/profs', coursController.getAllProfs);

module.exports = router;

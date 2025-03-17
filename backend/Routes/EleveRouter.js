// routes/eleve.js
const express = require('express');
const router = express.Router();
const EleveController = require('../Controllers/EleveController');

// Create a new Eleve and add it to a Class
router.post('/create', EleveController.createEleve);

// Add an existing Eleve to a Class
router.put('/add-to-class', EleveController.addEleveToClass);

// Remove an Eleve from a Class
router.delete('/remove-from-class', EleveController.removeEleveFromClass);

// Get all Eleves (optional: filter by parent)
router.get('/eleves', EleveController.getEleves);
// Get calanderie of student 
router.get('/:eleveId/courses', EleveController.getStudentCourses); // ✅ Add this
router.get('/:eleveId/courses', EleveController.getStudentCourses);


module.exports = router;

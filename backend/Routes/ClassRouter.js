// Routes/ClassRouter.js
const express = require('express');
const router = express.Router();
const classController = require('../Controllers/ClassController');

// Create a new class
router.post('/classes', classController.createClass);

// Retrieve all classes
router.get('/classes', classController.getAllClasses);

// Retrieve a single class by ID
router.get('/classes/:id', classController.getClassById);

// Update a class by ID
router.put('/classes/:id', classController.updateClass);

// Delete a class by ID
router.delete('/classes/:id', classController.deleteClass);

module.exports = router;

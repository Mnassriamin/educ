// routes/planningRoutes.js
const express = require('express');
const router = express.Router();
const PlanningController = require('../Controllers/PlanningController');

router.get('/courses', PlanningController.getAllPlannedCourses);
router.post('/course', PlanningController.addPlannedCourse);
router.delete('/course/:id', PlanningController.deletePlannedCourse);
router.put('/course/:id', PlanningController.updatePlannedCourse);
module.exports = router;

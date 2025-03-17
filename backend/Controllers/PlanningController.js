// Controllers/PlanningController.js
const Planning = require('../Models/Planning');
const { RRule } = require('rrule');

exports.getAllPlannedCourses = async (req, res) => {
  try {
    const courses = await Planning.find()
      .populate('matiere', 'name')
      .populate('enseignant', 'name')
      .populate('class', 'name');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addPlannedCourse = async (req, res) => {
  try {
    const { name, matiere, datedebut, datefin, class: classId, enseignant, color, recurrenceRule } = req.body;
    if (!name || !matiere || !datedebut || !datefin || !classId || !enseignant || !color) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // If a recurrence rule is provided, use it to create multiple events.
    if (recurrenceRule) {
      let rule;
      try {
        // Create a rule based on the provided recurrence rule string.
        rule = RRule.fromString(recurrenceRule);
      } catch (err) {
        return res.status(400).json({ message: "Invalid recurrence rule", error: err.message });
      }
      // Calculate duration difference between start and end.
      const startDate = new Date(datedebut);
      const endDate = new Date(datefin);
      const duration = endDate - startDate;

      // Get occurrences (for example, limit to 10 occurrences if rule.count is not specified).
      const occurrences = rule.all((date, i) => i < 10);
      const createdEvents = [];

      for (const occ of occurrences) {
        const newEvent = new Planning({
          name,
          matiere,
          datedebut: occ,
          datefin: new Date(occ.getTime() + duration),
          class: classId,
          enseignant,
          color,
          recurrenceRule, // store the rule if needed
        });
        const saved = await newEvent.save();
        createdEvents.push(saved);
      }
      return res.status(201).json({ message: "Planned course added recursively", courses: createdEvents });
    } else {
      // No recurrence, add as a single event.
      const newPlanning = new Planning({
        name,
        matiere,
        datedebut,
        datefin,
        class: classId,
        enseignant,
        color,
      });
      const savedPlanning = await newPlanning.save();
      return res.status(201).json({ message: "Planned course added successfully", course: savedPlanning });
    }
  } catch (err) {
    console.error("Error in addPlannedCourse:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deletePlannedCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Planning.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Planned course not found' });
    }
    res.status(200).json({ message: 'Planned course deleted successfully', course: deleted });
  } catch (err) {
    console.error("Error in deletePlannedCourse:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updatePlannedCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Planning.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Planned course not found' });
    }
    res.status(200).json({ message: 'Planned course updated successfully', course: updated });
  } catch (err) {
    console.error("Error in updatePlannedCourse:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// controllers/coursController.js

const Cours = require("../Models/Cours");
const Matiere = require("../Models/Matiere");
const Prof = require("../Models/Prof");
const Parent = require("../Models/Parent");
const ClassModel = require("../Models/Class"); // Import Class model for validation

// Create a course
exports.createCours = async (req, res) => {
  try {
    // Extract the required fields from the request body.
    // Note: We use "class" from req.body as "classId" to avoid conflict with the reserved keyword.
    const { name, matiere, datedebut, datefin, class: classId, color } = req.body;
    const enseignant = req.user.id; // Assumes req.user is populated by your authentication middleware

    // Validate that the provided Matiere exists
    const existingMatiere = await Matiere.findById(matiere);
    if (!existingMatiere) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }

    // Validate that the Prof (teacher) exists
    const existingProf = await Prof.findById(enseignant);
    if (!existingProf) {
      return res.status(404).json({ message: "Professeur non trouvé" });
    }

    // Validate that the provided Class exists
    const existingClass = await ClassModel.findById(classId);
    if (!existingClass) {
      return res.status(404).json({ message: "Classe non trouvée" });
    }

    // Create a new course based on the provided fields
    const cours = new Cours({
      name,
      matiere,
      enseignant,
      datedebut,
      datefin,
      class: classId,
      color,
    });

    const savedCours = await cours.save();
    res.status(201).json(savedCours);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all matieres
exports.getAllMatieres = async (req, res) => {
  try {
    const matieres = await Matiere.find();
    res.status(200).json(matieres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all professors
exports.getAllProfs = async (req, res) => {
  try {
    const profs = await Prof.find();
    res.status(200).json(profs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all courses with populated references
exports.getAllCours = async (req, res) => {
  try {
    const allCourses = await Cours.find()
      .populate("matiere", "name")       // Populate matiere with its name
      .populate("enseignant", "name")    // Populate enseignant with its name
      .populate("class", "name");         // Populate class with its name
    res.status(200).json(allCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a course
exports.deleteCours = async (req, res) => {
  try {
    const coursId = req.params.id;
    const deletedCours = await Cours.findByIdAndDelete(coursId);
    if (!deletedCours) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    res.status(200).json({ message: "Cours supprimé avec succès", deletedCours });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: error.message });
  }
};

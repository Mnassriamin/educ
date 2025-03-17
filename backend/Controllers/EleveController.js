//Controllers/EleveController.js
const Eleve = require('../Models/Eleve');
const Class = require('../Models/Class');
const Parent = require('../Models/Parent');
const Cours = require('../Models/Cours'); // ✅ Import the Cours model


// Create a new Eleve and add it to a Class
const createEleve = async (req, res) => {
  try {
    const { name, age, classId, parentId } = req.body;
    if (!name || !age || !classId || !parentId) {
      return res.status(400).json({ message: 'Missing required fields: name, age, classId, parentId' });
    }

    // Check if the Class exists
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(400).json({ message: 'Class not found' });
    }

    // Check if the Parent exists
    const parentDoc = await Parent.findById(parentId);
    if (!parentDoc) {
      return res.status(400).json({ message: 'Parent not found' });
    }

    // Create a new Eleve
    const newEleve = new Eleve({
      name,
      age,
      class: classId,
      parent: parentId,
    });
    await newEleve.save();

    // Update the Class document to include the new Eleve
    classDoc.eleves.push(newEleve._id);
    await classDoc.save();

    res.status(201).json({ success: true, message: 'Eleve created successfully', eleve: newEleve });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Add an existing Eleve to a Class
const addEleveToClass = async (req, res) => {
  try {
    const { eleveId, classId } = req.body;
    if (!eleveId || !classId) {
      return res.status(400).json({ message: 'Missing required fields: eleveId and classId' });
    }

    // Find the Eleve and Class
    const eleve = await Eleve.findById(eleveId);
    if (!eleve) {
      return res.status(400).json({ message: 'Eleve not found' });
    }
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(400).json({ message: 'Class not found' });
    }

    // Check if the Eleve is already in the Class
    if (classDoc.eleves.includes(eleveId)) {
      return res.status(400).json({ message: 'Eleve is already in this class' });
    }

    // Add the Eleve to the Class and update the Eleve's class field
    classDoc.eleves.push(eleveId);
    await classDoc.save();

    eleve.class = classId;
    await eleve.save();

    res.status(200).json({ success: true, message: 'Eleve added to class successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Remove an Eleve from a Class
const removeEleveFromClass = async (req, res) => {
  try {
    const { eleveId, classId } = req.body;
    if (!eleveId || !classId) {
      return res.status(400).json({ message: 'Missing required fields: eleveId and classId' });
    }

    // Find the Class document
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(400).json({ message: 'Class not found' });
    }

    // Check if the Eleve is in the Class
    if (!classDoc.eleves.includes(eleveId)) {
      return res.status(400).json({ message: 'Eleve is not in this class' });
    }

    // Remove the Eleve from the Class
    classDoc.eleves = classDoc.eleves.filter(id => id.toString() !== eleveId);
    await classDoc.save();

    // Optionally, update the Eleve's class field (e.g., set it to null)
    const eleve = await Eleve.findById(eleveId);
    if (eleve) {
      eleve.class = null;
      await eleve.save();
    }

    res.status(200).json({ success: true, message: 'Eleve removed from class successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
const getEleves = async (req, res) => {
  try {
    const { parent } = req.query;
    let eleves;
    if (parent) {
      // Find eleves that belong to the given parent ID
      eleves = await Eleve.find({ parent });
    } else {
      // If no parent is specified, return all eleves (optional)
      eleves = await Eleve.find();
    }
    res.status(200).json(eleves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// controllers/EleveController.js

//see calanderie of student



// New function: Get the courses for a student (i.e. the courses of the class the student is assigned to)
// Get the student's class and fetch all courses assigned to that class
const getStudentCourses = async (req, res) => {
  try {
    const { eleveId } = req.params;

    // Find the student and populate their class
    const student = await Eleve.findById(eleveId).populate("class");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.class) {
      return res.status(400).json({ message: "Student is not assigned to any class" });
    }

    // Find all courses for the student's class
    const courses = await Cours.find({ class: student.class._id })
      .populate("matiere", "name")   // Populate subject details
      .populate("enseignant", "name"); // Populate teacher details

    res.status(200).json({
      student: student.name,
      class: student.class.name,
      courses
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving courses for student",
      error: error.message
    });
  }
};


module.exports = {
  createEleve,
  addEleveToClass,
  removeEleveFromClass,
  getEleves,
  getStudentCourses  // Export the new function
};



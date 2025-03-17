// controllers/ClassController.js
const Class = require('../Models/Class');

// Create a new Class
exports.createClass = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const newClass = new Class({ name });
    const savedClass = await newClass.save();
    res.status(201).json({ message: 'Class created successfully', class: savedClass });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Retrieve all Classes
exports.getAllClasses = async (req, res) => {
  try {
    // Optionally populate eleves if you want to return student details
    const classes = await Class.find().populate('eleves', 'name');
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Retrieve a single Class by ID
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundClass = await Class.findById(id).populate('eleves', 'name');
    if (!foundClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json(foundClass);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a Class
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, eleves } = req.body;
    const updatedData = {};
    if (name) updatedData.name = name;
    if (eleves) updatedData.eleves = eleves;
    
    const updatedClass = await Class.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class updated successfully', class: updatedClass });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a Class
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted successfully', class: deletedClass });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const Matiere = require('../Models/Matiere');  // Import Matiere model 
const Admin = require('../Models/Admin');
const Prof = require('../Models/Prof');
const Parent = require('../Models/Parent');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../Middlewares/AuthValidation');

// Register a Prof
const registerProf = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { name, email, password, telephone, matiereId, etudiants } = req.body;

    const profExists = await Prof.findOne({ email });
    if (profExists) return res.status(400).json({ message: 'Prof already exists' });

    // Validate the matiereId is valid by checking if a Matiere with that ID exists
    const matiereExists = await Matiere.findOne({ _id: matiereId });
    if (!matiereExists) return res.status(400).json({ message: 'Invalid Matiere ID' });

    // Create a new Prof
    const newProf = new Prof({
      name,
      email,
      password, // Password will be hashed in the schema middleware
      telephone,
      matiereId, // Validated Matiere ID
    });

    await newProf.save();
    res.status(201).json({ success: true, message: 'Prof registered successfully', prof: newProf });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Register a Parent
const registerParent = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const parentExists = await Parent.findOne({ email: req.body.email });
    if (parentExists) return res.status(400).json({ message: 'Parent already exists' });

    // Create a new Parent instance explicitly
    const newParent = new Parent({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // Password will be hashed in the schema middleware
      telephone: req.body.telephone,
      enfants: req.body.enfants || []
    });

    await newParent.save();
    res.status(201).json({ success: true, message: 'Parent registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Single Login for Admin, Prof, and Parent
const loginUser = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { email, password } = req.body;
    let user;
    let userType = null;

    // First, check if the user is an Admin.
    user = await Admin.findOne({ email });
    if (user) {
      userType = "admin";
    } else {
      // If not admin, check Prof.
      user = await Prof.findOne({ email });
      if (user) {
        userType = "prof";
      } else {
        // If not a professor, check Parent.
        user = await Parent.findOne({ email });
        if (user) {
          userType = "parent";
        }
      }
    }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Build token payload. If professor, include the linked matiereId.
    const tokenPayload = { id: user._id, type: userType };
    if (userType === 'prof') {
      tokenPayload.matiereId = user.matiereId;
    }
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} login successful`,
      token,
      type: userType,
      userId: user._id,
      matiereId: userType === 'prof' ? user.matiereId : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Parent Info (including linked enfants)
const getParentInfo = async (req, res) => {
  try {
    const { id } = req.params;
    // Only select the enfants field so that we only get the parent's linked children.
    const parent = await Parent.findById(id).select("enfants");
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    res.status(200).json({ enfants: parent.enfants });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerProf, registerParent, loginUser, getParentInfo };
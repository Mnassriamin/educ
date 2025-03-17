const express = require('express');
const router = express.Router();
const { registerProf, registerParent, loginUser, getParentInfo } = require('../Controllers/AuthController'); // Import loginUser

// Routes for registration
router.post('/register/prof', registerProf);
router.post('/register/parent', registerParent);
router.get('/parent/:id', getParentInfo);


// Route for login (single route)
router.post('/login', loginUser); // Use loginUser

module.exports = router;
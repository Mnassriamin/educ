// auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    // If the header is "Bearer xxxxxx", remove the leading "Bearer "
    // e.g. "Bearer 123abc" => "123abc"
    if (token.startsWith('Bearer ')) {
      token = token.slice(7); 
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token invalide' });
  }
};

module.exports = verifyToken;

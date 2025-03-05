// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist.model');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    // console.log("This is toke " + token)

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });

    }

    const blacklisted = await TokenBlacklist.findOne({ where: { token: token } }); 
    if (blacklisted) {
      return res.status(401).json({ error: 'Token is blacklisted' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    req.user = decoded; 
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
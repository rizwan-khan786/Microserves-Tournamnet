// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

if (!process.env.JWT_ACCESS_SECRET) {
  console.error("JWT_ACCESS_SECRET not set!");
  process.exit(1);
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader)
    return res.status(401).json({ success: false, message: 'No token provided' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer')
    return res.status(401).json({ success: false, message: 'Invalid token format' });

  const token = parts[1];

  // try {
  //   const decoded = jwt.verify(token, ACCESS_SECRET);
  //   req.user = decoded; // { id, email, role, iat, exp }
  //   next();
  // } catch (err) {
  //   return res.status(403).json({ success: false, message: 'Access to the resource is prohibited' });
  // }
  try {
  const decoded = jwt.verify(token, ACCESS_SECRET);
  console.log('Token decoded:', decoded);
  req.user = decoded;
  next();
} catch (err) {
  console.error('Token verification failed:', err.message);
  return res.status(403).json({ success: false, message: 'Access to the resource is prohibited' });
}

};

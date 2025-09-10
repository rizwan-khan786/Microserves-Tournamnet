// utils/jwt.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'XYST';

/**
 * Verify access token from auth-service
 * Returns decoded user payload if valid, else null
 */
function verifyUserToken(token) {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    return decoded; // { id, email, role, iat, exp }
  } catch (err) {
    return null;
  }
}

module.exports = { verifyUserToken };

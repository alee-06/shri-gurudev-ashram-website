const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Optional Auth Middleware
 * - If valid token is provided, attaches user to req.user
 * - If no token or invalid token, continues without user (guest mode)
 * - Never returns 401, always allows request to proceed
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token provided - continue as guest
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = {
          id: decoded.userId,
          role: decoded.role,
        };
      } else {
        req.user = null;
      }
    } catch (tokenError) {
      // Invalid/expired token - continue as guest
      req.user = null;
    }

    next();
  } catch (error) {
    // Any error - continue as guest
    req.user = null;
    next();
  }
};

module.exports = optionalAuthMiddleware;

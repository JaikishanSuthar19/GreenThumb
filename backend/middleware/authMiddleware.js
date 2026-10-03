const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { admin, firebaseInitialized } = require('../config/firebase');

/**
 * Protect routes - Authenticate via JWT or Firebase ID token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route, no token provided',
    });
  }

  try {
    // 1. Try standard JWT token first
    const jwtSecret = process.env.JWT_SECRET || 'greenthumb_super_secret_jwt_key_2026';
    try {
      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    } catch (jwtErr) {
      // If standard JWT failed, check if it's a Firebase ID token
      if (firebaseInitialized && admin) {
        try {
          const decodedFirebase = await admin.auth().verifyIdToken(token);
          let user = await User.findOne({
            $or: [{ firebaseUid: decodedFirebase.uid }, { email: decodedFirebase.email }],
          });

          if (!user) {
            // Auto-provision user if Firebase authenticated
            user = await User.create({
              name: decodedFirebase.name || decodedFirebase.email.split('@')[0],
              email: decodedFirebase.email,
              firebaseUid: decodedFirebase.uid,
              avatar: decodedFirebase.picture || undefined,
            });
          }

          req.user = user;
          return next();
        } catch (firebaseErr) {
          // Token invalid in both
          throw new Error('Invalid authentication token');
        }
      } else {
        throw jwtErr;
      }
    }

    return res.status(401).json({
      success: false,
      message: 'User belonging to this token no longer exists',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Invalid or expired token.',
      error: error.message,
    });
  }
};

/**
 * Optional protect - populates req.user if valid token provided, but doesn't block if absent
 */
const optionalProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'greenthumb_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Silently continue without user
  }
  next();
};

module.exports = { protect, optionalProtect };


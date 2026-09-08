import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { sendError } from '../utils/response.js';

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'Authentication required. Please log in.');
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return sendError(res, 401, 'Invalid or expired token.');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 401, 'User not found or account removed.');
    }

    const student = await Student.findOne({ user: user._id });

    req.user = user;
    req.student = student;
    next();
  } catch (error) {
    return sendError(res, 401, 'Authentication failed: ' + error.message);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded?.id) {
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
          req.student = await Student.findOne({ user: user._id });
        }
      }
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }
  next();
};

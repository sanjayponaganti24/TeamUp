import * as authService from '../services/auth-service.js';
import { setAuthCookie, clearAuthCookie } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { user, student, token } = await authService.registerUser(req.body);
    setAuthCookie(res, token);
    return sendSuccess(res, 201, 'Registration successful', { user, student, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, student, token } = await authService.loginUser(req.body);
    setAuthCookie(res, token);
    return sendSuccess(res, 200, 'Login successful', { user, student, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  clearAuthCookie(res);
  return sendSuccess(res, 200, 'Logged out successfully');
};

export const getMe = async (req, res, next) => {
  try {
    const data = await authService.getCurrentUser(req.user._id);
    return sendSuccess(res, 200, 'Current user loaded', data);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res) => {
  return sendSuccess(
    res,
    200,
    'If an account exists with this email, password reset instructions have been generated.'
  );
};

export const resetPassword = async (req, res) => {
  return sendSuccess(res, 200, 'Password has been reset successfully. Please log in.');
};

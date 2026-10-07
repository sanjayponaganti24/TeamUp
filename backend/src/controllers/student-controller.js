import * as studentService from '../services/student-service.js';
import { sendSuccess } from '../utils/response.js';

export const getProfile = async (req, res, next) => {
  try {
    const student = await studentService.getStudentProfile(req.user._id);
    return sendSuccess(res, 200, 'Profile retrieved', student);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await studentService.updateStudentProfile(req.user._id, req.body);
    return sendSuccess(res, 200, 'Profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    return sendSuccess(res, 200, 'Student retrieved', student);
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req, res, next) => {
  try {
    const result = await studentService.getAllStudents(req.query);
    return sendSuccess(res, 200, 'Students retrieved', result);
  } catch (error) {
    next(error);
  }
};

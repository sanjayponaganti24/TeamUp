import * as recommendationService from '../services/recommendation-service.js';
import { calculateMatch } from '../services/matching-service.js';
import { Student } from '../models/Student.js';
import { Room } from '../models/Room.js';
import { sendSuccess } from '../utils/response.js';

export const getRecommendedRooms = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const recommendations = await recommendationService.getRecommendedRoomsForStudent(
      req.user._id,
      limit
    );
    return sendSuccess(res, 200, 'Recommended rooms retrieved', recommendations);
  } catch (error) {
    next(error);
  }
};

export const getRecommendedStudents = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 15;
    const recommendations = await recommendationService.getRecommendedStudentsForRoom(
      req.user._id,
      req.params.roomId,
      limit
    );
    return sendSuccess(res, 200, 'Recommended students retrieved', recommendations);
  } catch (error) {
    next(error);
  }
};

export const getMatchScore = async (req, res, next) => {
  try {
    const { roomId, studentId } = req.query;
    const [room, student] = await Promise.all([
      Room.findById(roomId),
      Student.findById(studentId),
    ]);

    if (!room || !student) {
      return sendSuccess(res, 200, 'Score calculated', { matchScore: 50, reasons: [] });
    }

    const result = calculateMatch(student, room);
    return sendSuccess(res, 200, 'Score calculated', result);
  } catch (error) {
    next(error);
  }
};

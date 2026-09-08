import { Room } from '../models/Room.js';
import { Student } from '../models/Student.js';
import { ROOM_STATUS } from '../constants/room-status.js';
import { calculateMatch } from './matching-service.js';

export const getRecommendedRoomsForStudent = async (userId, limit = 10) => {
  const student = await Student.findOne({ user: userId });
  if (!student) {
    return [];
  }

  const openRooms = await Room.find({
    status: ROOM_STATUS.OPEN,
    deadline: { $gte: new Date() },
    host: { $ne: userId },
    'members.user': { $ne: userId },
  })
    .populate('host', 'name email')
    .populate('hostStudent', 'name branch year skills')
    .limit(50);

  const scoredRooms = openRooms.map((room) => {
    const { matchScore, reasons } = calculateMatch(student, room);
    return {
      room,
      matchScore,
      reasons,
    };
  });

  scoredRooms.sort((a, b) => b.matchScore - a.matchScore);
  return scoredRooms.slice(0, limit);
};

export const getRecommendedStudentsForRoom = async (userId, roomId, limit = 15) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  if (room.host.toString() !== userId.toString()) {
    const error = new Error('Unauthorized. Only the room host can view candidate recommendations.');
    error.statusCode = 403;
    throw error;
  }

  const existingMemberStudentIds = room.members.map((m) => m.student.toString());

  const candidates = await Student.find({
    _id: { $nin: existingMemberStudentIds },
    user: { $ne: userId },
  })
    .populate('user', 'name email')
    .limit(50);

  const scoredStudents = candidates.map((student) => {
    const { matchScore, reasons } = calculateMatch(student, room);
    return {
      student,
      matchScore,
      reasons,
    };
  });

  scoredStudents.sort((a, b) => b.matchScore - a.matchScore);
  return scoredStudents.slice(0, limit);
};

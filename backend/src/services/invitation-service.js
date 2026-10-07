import { Invitation } from '../models/Invitation.js';
import { Room } from '../models/Room.js';
import { Student } from '../models/Student.js';
import { INVITATION_STATUS } from '../constants/invitation-status.js';
import { ROOM_STATUS } from '../constants/room-status.js';
import { createNotification, NOTIFICATION_TYPES } from './notification-service.js';
import { emitToRoom, emitToUser } from '../sockets/socket.js';

export const inviteStudent = async (userId, { roomId, studentId, role, message }) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }

  if (room.host.toString() !== userId.toString()) {
    const error = new Error('Unauthorized. Only the room host can invite members.');
    error.statusCode = 403;
    throw error;
  }

  if (room.status !== ROOM_STATUS.OPEN) {
    const error = new Error(`Cannot invite students when room is ${room.status}.`);
    error.statusCode = 400;
    throw error;
  }

  const student = await Student.findById(studentId);
  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  const isMember = room.members.some((m) => m.student.toString() === studentId.toString());
  if (isMember) {
    const error = new Error('This student is already a member of the room.');
    error.statusCode = 400;
    throw error;
  }

  const existingInvitation = await Invitation.findOne({
    room: roomId,
    student: studentId,
    status: INVITATION_STATUS.PENDING,
  });
  if (existingInvitation) {
    const error = new Error('An active invitation has already been sent to this student.');
    error.statusCode = 400;
    throw error;
  }

  const invitation = await Invitation.create({
    room: roomId,
    student: studentId,
    invitedBy: userId,
    role: role || 'Member',
    message: message || '',
    status: INVITATION_STATUS.PENDING,
  });

  createNotification({
    recipient: student.user,
    sender: userId,
    type: NOTIFICATION_TYPES.INVITATION,
    title: 'Team Invitation! ✉️',
    message: `You were invited to join "${room.name}" as ${role || 'Member'}.`,
    link: `/notifications/invitations`,
    room: room._id,
  });

  const populated = await Invitation.findById(invitation._id)
    .populate('room', 'name type host deadline capacity')
    .populate('student', 'name email branch year skills');

  emitToUser(student.user, 'INVITATION_RECEIVED', populated);

  return populated;
};

export const respondToInvitation = async (userId, invitationId, { status }) => {
  const student = await Student.findOne({ user: userId });
  if (!student) {
    const error = new Error('Student profile not found.');
    error.statusCode = 404;
    throw error;
  }

  const invitation = await Invitation.findById(invitationId).populate('room');
  if (!invitation) {
    const error = new Error('Invitation not found.');
    error.statusCode = 404;
    throw error;
  }

  if (invitation.student.toString() !== student._id.toString()) {
    const error = new Error('Unauthorized. This invitation was not addressed to you.');
    error.statusCode = 403;
    throw error;
  }

  if (invitation.status !== INVITATION_STATUS.PENDING) {
    const error = new Error(`Invitation has already been ${invitation.status.toLowerCase()}.`);
    error.statusCode = 400;
    throw error;
  }

  const room = await Room.findById(invitation.room._id);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }

  invitation.status = status;
  invitation.respondedAt = new Date();

  if (status === INVITATION_STATUS.ACCEPTED) {
    if (room.members.length >= room.capacity) {
      const error = new Error('Room is already full.');
      error.statusCode = 400;
      throw error;
    }

    room.members.push({
      student: student._id,
      user: userId,
      role: invitation.role || 'Member',
      joinedAt: new Date(),
    });

    if (room.members.length >= room.capacity) {
      room.status = ROOM_STATUS.FULL;
    }

    await room.save();

    createNotification({
      recipient: room.host,
      sender: userId,
      type: NOTIFICATION_TYPES.INVITATION_ACCEPTED,
      title: 'Invitation Accepted! 🤝',
      message: `${student.name} accepted your invitation to join "${room.name}".`,
      link: `/team/${room._id}`,
      room: room._id,
    });

    emitToRoom(room._id, 'MEMBER_JOINED', { room, member: student });
  } else if (status === INVITATION_STATUS.DECLINED) {
    createNotification({
      recipient: room.host,
      sender: userId,
      type: NOTIFICATION_TYPES.INVITATION_DECLINED,
      title: 'Invitation Declined',
      message: `${student.name} declined the invitation to join "${room.name}".`,
      link: `/rooms/${room._id}`,
      room: room._id,
    });
  }

  await invitation.save();
  return invitation;
};

export const getMyInvitations = async (userId) => {
  const student = await Student.findOne({ user: userId });
  if (!student) return [];

  const invitations = await Invitation.find({ student: student._id })
    .sort({ createdAt: -1 })
    .populate('room', 'name type status deadline capacity members host')
    .populate('invitedBy', 'name email');

  return invitations;
};

export const getRoomInvitations = async (userId, roomId) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }

  if (room.host.toString() !== userId.toString()) {
    const error = new Error('Unauthorized.');
    error.statusCode = 403;
    throw error;
  }

  const invitations = await Invitation.find({ room: roomId })
    .sort({ createdAt: -1 })
    .populate('student', 'name email branch year skills availability preferredRoles');

  return invitations;
};

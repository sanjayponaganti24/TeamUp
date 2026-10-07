import { Application } from '../models/Application.js';
import { Room } from '../models/Room.js';
import { Student } from '../models/Student.js';
import { APPLICATION_STATUS } from '../constants/application-status.js';
import { ROOM_STATUS } from '../constants/room-status.js';
import { createNotification, NOTIFICATION_TYPES } from './notification-service.js';
import { emitToRoom, emitToUser } from '../sockets/socket.js';

export const applyToRoom = async (userId, { roomId, message, requestedRole }) => {
  const student = await Student.findOne({ user: userId });
  if (!student) {
    const error = new Error('Student profile not found.');
    error.statusCode = 404;
    throw error;
  }

  const room = await Room.findById(roomId);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }

  // Verification checks
  if (room.status !== ROOM_STATUS.OPEN) {
    const error = new Error(`Cannot join room with status: ${room.status}`);
    error.statusCode = 400;
    throw error;
  }

  if (new Date() > new Date(room.deadline)) {
    const error = new Error('Application deadline for this room has passed.');
    error.statusCode = 400;
    throw error;
  }

  const isMember = room.members.some((m) => m.user.toString() === userId.toString());
  if (isMember) {
    const error = new Error('You are already a member of this room.');
    error.statusCode = 400;
    throw error;
  }

  const existingApp = await Application.findOne({
    room: roomId,
    student: student._id,
    status: APPLICATION_STATUS.PENDING,
  });
  if (existingApp) {
    const error = new Error('You already have a pending application for this room.');
    error.statusCode = 400;
    throw error;
  }

  // Auto-accept handling
  if (room.autoAccept && room.members.length < room.capacity) {
    const application = await Application.create({
      room: roomId,
      student: student._id,
      user: userId,
      message,
      requestedRole: requestedRole || 'Member',
      status: APPLICATION_STATUS.ACCEPTED,
      reviewedAt: new Date(),
      reviewerFeedback: 'Automatically accepted by room rules.',
    });

    room.members.push({
      student: student._id,
      user: userId,
      role: requestedRole || 'Member',
      joinedAt: new Date(),
    });

    if (room.members.length >= room.capacity) {
      room.status = ROOM_STATUS.FULL;
    }
    await room.save();

    createNotification({
      recipient: room.host,
      sender: userId,
      type: NOTIFICATION_TYPES.MEMBER_JOINED,
      title: 'New Member Joined (Auto-Accept)',
      message: `${student.name} joined your room "${room.name}".`,
      link: `/rooms/${room._id}`,
      room: room._id,
    });

    createNotification({
      recipient: userId,
      sender: room.host,
      type: NOTIFICATION_TYPES.REQUEST_ACCEPTED,
      title: 'Joined Room Successfully!',
      message: `You are now a member of "${room.name}".`,
      link: `/team/${room._id}`,
      room: room._id,
    });

    emitToRoom(roomId, 'MEMBER_JOINED', { room, member: student });
    return application;
  }

  // Standard Pending Application
  const application = await Application.create({
    room: roomId,
    student: student._id,
    user: userId,
    message,
    requestedRole: requestedRole || 'Member',
    status: APPLICATION_STATUS.PENDING,
  });

  createNotification({
    recipient: room.host,
    sender: userId,
    type: NOTIFICATION_TYPES.JOIN_REQUEST,
    title: 'New Join Request',
    message: `${student.name} requested to join "${room.name}" as ${requestedRole || 'Member'}.`,
    link: `/rooms/${room._id}/requests`,
    room: room._id,
  });

  const populated = await Application.findById(application._id)
    .populate('student', 'name email branch year skills availability preferredRoles')
    .populate('room', 'name type');

  emitToUser(room.host, 'APPLICATION_RECEIVED', populated);

  return populated;
};

export const reviewApplication = async (userId, applicationId, { status, reviewerFeedback }) => {
  const application = await Application.findById(applicationId)
    .populate('student')
    .populate('room');

  if (!application) {
    const error = new Error('Application not found.');
    error.statusCode = 404;
    throw error;
  }

  const room = await Room.findById(application.room._id);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }

  if (room.host.toString() !== userId.toString()) {
    const error = new Error('Unauthorized. Only the room host can review applications.');
    error.statusCode = 403;
    throw error;
  }

  if (application.status !== APPLICATION_STATUS.PENDING) {
    const error = new Error(`Application has already been ${application.status.toLowerCase()}.`);
    error.statusCode = 400;
    throw error;
  }

  application.status = status;
  application.reviewerFeedback = reviewerFeedback || '';
  application.reviewedAt = new Date();

  if (status === APPLICATION_STATUS.ACCEPTED) {
    if (room.members.length >= room.capacity) {
      const error = new Error('Room has already reached full capacity.');
      error.statusCode = 400;
      throw error;
    }

    room.members.push({
      student: application.student._id,
      user: application.user,
      role: application.requestedRole || 'Member',
      joinedAt: new Date(),
    });

    if (room.members.length >= room.capacity) {
      room.status = ROOM_STATUS.FULL;
    }

    await room.save();

    createNotification({
      recipient: application.user,
      sender: userId,
      type: NOTIFICATION_TYPES.REQUEST_ACCEPTED,
      title: 'Application Accepted! 🎉',
      message: `Your request to join "${room.name}" was accepted by the host!`,
      link: `/team/${room._id}`,
      room: room._id,
    });

    emitToRoom(room._id, 'MEMBER_JOINED', { room, member: application.student });
  } else if (status === APPLICATION_STATUS.REJECTED) {
    createNotification({
      recipient: application.user,
      sender: userId,
      type: NOTIFICATION_TYPES.REQUEST_REJECTED,
      title: 'Application Update',
      message: `Your request to join "${room.name}" was not accepted.`,
      link: `/rooms/${room._id}`,
      room: room._id,
    });
  }

  await application.save();

  emitToUser(application.user, 'APPLICATION_STATUS', application);

  return application;
};

export const getRoomApplications = async (userId, roomId) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }

  if (room.host.toString() !== userId.toString()) {
    const error = new Error('Unauthorized. Only the host can view room applications.');
    error.statusCode = 403;
    throw error;
  }

  const applications = await Application.find({ room: roomId })
    .sort({ createdAt: -1 })
    .populate('student', 'name email branch year skills availability preferredRoles bio githubUrl linkedinUrl');

  return applications;
};

export const getMyApplications = async (userId) => {
  const applications = await Application.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('room', 'name type status deadline capacity members host');

  return applications;
};

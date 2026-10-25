import { Room } from '../models/Room.js';
import { Student } from '../models/Student.js';
import { ROOM_STATUS } from '../constants/room-status.js';
import { emitGlobal, emitToRoom } from '../sockets/socket.js';
import { createNotification, NOTIFICATION_TYPES } from './notification-service.js';

export const createRoom = async (userId, roomData) => {
  const student = await Student.findOne({ user: userId });
  if (!student) {
    const error = new Error('Student profile not found.');
    error.statusCode = 404;
    throw error;
  }

  const room = await Room.create({
    ...roomData,
    host: userId,
    hostStudent: student._id,
    members: [
      {
        student: student._id,
        user: userId,
        role: roomData.hostRole || 'Host / Team Lead',
        joinedAt: new Date(),
      },
    ],
    status: roomData.status || ROOM_STATUS.OPEN,
  });

  const populated = await Room.findById(room._id)
    .populate('host', 'name email')
    .populate('hostStudent', 'name branch year skills availability')
    .populate('members.student', 'name email branch year skills availability')
    .populate('members.user', 'name email');

  emitGlobal('ROOM_CREATED', populated);
  return populated;
};

export const getRooms = async ({
  search = '',
  type = '',
  status = '',
  branch = '',
  skill = '',
  page = 1,
  limit = 20,
}) => {
  const filter = {};

  if (status && status !== 'ALL') {
    filter.status = status;
  } else {
    // The explicit ALL filter includes every persisted room status.
    filter.status = {
      $in: status === 'ALL'
        ? Object.values(ROOM_STATUS)
        : [ROOM_STATUS.OPEN, ROOM_STATUS.FULL, ROOM_STATUS.IN_PROGRESS],
    };
  }

  if (type) {
    filter.type = type;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { requiredSkills: { $regex: search, $options: 'i' } },
    ];
  }

  if (branch) {
    filter.requiredBranches = { $in: [new RegExp(`^${branch}$`, 'i')] };
  }

  if (skill) {
    filter.requiredSkills = { $in: [new RegExp(`^${skill}$`, 'i')] };
  }

  const skip = (page - 1) * limit;

  const [rooms, total] = await Promise.all([
    Room.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('host', 'name email')
      .populate('hostStudent', 'name branch year skills availability')
      .populate('members.student', 'name email branch year skills availability'),
    Room.countDocuments(filter),
  ]);

  return {
    rooms,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getRoomById = async (roomId) => {
  const room = await Room.findById(roomId)
    .populate('host', 'name email')
    .populate('hostStudent', 'name branch year skills availability bio githubUrl linkedinUrl')
    .populate('members.student', 'name email branch year skills availability preferredRoles bio')
    .populate('members.user', 'name email');

  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  return room;
};

export const updateRoom = async (roomId, userId, updateData) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  if (room.host.toString() !== userId.toString()) {
    const error = new Error('Unauthorized. Only the host can update room details.');
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = [
    'name',
    'description',
    'type',
    'capacity',
    'requiredBranches',
    'requiredSkills',
    'requiredRoles',
    'deadline',
    'startDate',
    'endDate',
    'autoAccept',
    'typeDetails',
  ];

  let requirementChanged = false;
  if (updateData.requiredSkills || updateData.requiredBranches || updateData.requiredRoles) {
    requirementChanged = true;
  }

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      room[field] = updateData[field];
    }
  });

  // Check if capacity update affects status
  if (room.members.length >= room.capacity && room.status === ROOM_STATUS.OPEN) {
    room.status = ROOM_STATUS.FULL;
  } else if (room.members.length < room.capacity && room.status === ROOM_STATUS.FULL) {
    room.status = ROOM_STATUS.OPEN;
  }

  await room.save();

  const populated = await Room.findById(room._id)
    .populate('host', 'name email')
    .populate('hostStudent', 'name branch year skills availability')
    .populate('members.student', 'name email branch year skills availability');

  emitToRoom(roomId, 'ROOM_UPDATED', populated);

  if (requirementChanged) {
    // Notify members
    room.members.forEach((m) => {
      if (m.user.toString() !== userId.toString()) {
        createNotification({
          recipient: m.user,
          sender: userId,
          type: NOTIFICATION_TYPES.REQUIREMENT_CHANGED,
          title: 'Room Requirements Changed',
          message: `Host updated the criteria for team "${room.name}".`,
          link: `/rooms/${room._id}`,
          room: room._id,
        });
      }
    });
  }

  return populated;
};

export const updateRoomStatus = async (roomId, userId, status) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  if (room.host.toString() !== userId.toString()) {
    const error = new Error('Unauthorized. Only the host can update room status.');
    error.statusCode = 403;
    throw error;
  }

  room.status = status;
  await room.save();

  const populated = await Room.findById(room._id)
    .populate('host', 'name email')
    .populate('hostStudent', 'name branch year skills availability')
    .populate('members.student', 'name email branch year skills availability');

  emitToRoom(roomId, 'ROOM_STATUS_CHANGED', populated);

  if (status === ROOM_STATUS.COMPLETED) {
    room.members.forEach((m) => {
      createNotification({
        recipient: m.user,
        sender: userId,
        type: NOTIFICATION_TYPES.ROOM_COMPLETED,
        title: 'Project Completed! 🎉',
        message: `Your team "${room.name}" has been marked as Completed.`,
        link: `/team/${room._id}`,
        room: room._id,
      });
    });
  }

  return populated;
};

export const leaveRoom = async (roomId, userId) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  if (room.host.toString() === userId.toString()) {
    const error = new Error('Host cannot leave the room. You may cancel the room instead.');
    error.statusCode = 400;
    throw error;
  }

  const memberIndex = room.members.findIndex((m) => m.user.toString() === userId.toString());
  if (memberIndex === -1) {
    const error = new Error('You are not a member of this room.');
    error.statusCode = 400;
    throw error;
  }

  const leavingMember = room.members[memberIndex];
  room.members.splice(memberIndex, 1);

  if (room.status === ROOM_STATUS.FULL && room.members.length < room.capacity) {
    room.status = ROOM_STATUS.OPEN;
  }

  await room.save();

  createNotification({
    recipient: room.host,
    sender: userId,
    type: NOTIFICATION_TYPES.MEMBER_LEFT,
    title: 'Member Left Team',
    message: `A teammate has left your room "${room.name}".`,
    link: `/rooms/${room._id}`,
    room: room._id,
  });

  emitToRoom(roomId, 'MEMBER_LEFT', { roomId, userId });

  return { success: true, message: 'You have left the room.' };
};

export const getMyRooms = async (userId) => {
  const student = await Student.findOne({ user: userId });
  const hosted = await Room.find({ host: userId })
    .sort({ createdAt: -1 })
    .populate('members.student', 'name email branch year skills');

  const joined = await Room.find({
    'members.user': userId,
    host: { $ne: userId },
  })
    .sort({ createdAt: -1 })
    .populate('host', 'name email')
    .populate('members.student', 'name email branch year skills');

  return { hosted, joined };
};

import { RoomUpdate } from '../models/RoomUpdate.js';
import { Room } from '../models/Room.js';
import { emitToRoom } from '../sockets/socket.js';

export const createRoomUpdate = async (userId, roomId, { title, content, type, pinned }) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  const isMember = room.members.some((m) => m.user.toString() === userId.toString());
  if (!isMember) {
    const error = new Error('Only room members can post updates.');
    error.statusCode = 403;
    throw error;
  }

  const update = await RoomUpdate.create({
    room: roomId,
    author: userId,
    title,
    content,
    type: type || 'UPDATE',
    pinned: pinned || false,
  });

  const populated = await RoomUpdate.findById(update._id).populate('author', 'name email');

  emitToRoom(roomId, 'ROOM_UPDATE_POSTED', populated);

  return populated;
};

export const getRoomUpdates = async (roomId) => {
  const updates = await RoomUpdate.find({ room: roomId })
    .sort({ pinned: -1, createdAt: -1 })
    .populate('author', 'name email');

  return updates;
};

export const deleteRoomUpdate = async (userId, updateId) => {
  const update = await RoomUpdate.findById(updateId).populate('room');
  if (!update) {
    const error = new Error('Update not found');
    error.statusCode = 404;
    throw error;
  }

  const isAuthor = update.author.toString() === userId.toString();
  const isHost = update.room.host.toString() === userId.toString();

  if (!isAuthor && !isHost) {
    const error = new Error('Unauthorized to delete this update.');
    error.statusCode = 403;
    throw error;
  }

  await RoomUpdate.findByIdAndDelete(updateId);
  return true;
};

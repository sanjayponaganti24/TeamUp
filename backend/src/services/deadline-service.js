import { Room } from '../models/Room.js';
import { ROOM_STATUS } from '../constants/room-status.js';
import { createNotification, NOTIFICATION_TYPES } from './notification-service.js';
import { emitToRoom, emitGlobal } from '../sockets/socket.js';

export const processDeadlines = async () => {
  try {
    const now = new Date();

    // 1. Expire Open rooms whose deadline has passed
    const expiredRooms = await Room.find({
      status: ROOM_STATUS.OPEN,
      deadline: { $lt: now },
    });

    for (const room of expiredRooms) {
      room.status = ROOM_STATUS.EXPIRED;
      await room.save();

      console.log(`[Deadline Job] Room ${room.name} (${room._id}) expired.`);

      createNotification({
        recipient: room.host,
        type: NOTIFICATION_TYPES.DEADLINE_REACHED,
        title: 'Room Deadline Reached ⏰',
        message: `Application deadline for your room "${room.name}" has expired.`,
        link: `/rooms/${room._id}`,
        room: room._id,
      });

      emitToRoom(room._id, 'ROOM_STATUS_CHANGED', room);
    }

    // 2. Deadline Warnings (within 24 hours)
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const approachingRooms = await Room.find({
      status: ROOM_STATUS.OPEN,
      deadline: { $gt: now, $lte: tomorrow },
    });

    for (const room of approachingRooms) {
      emitToRoom(room._id, 'DEADLINE_APPROACHING', {
        roomId: room._id,
        deadline: room.deadline,
      });
    }
  } catch (error) {
    console.error('[Deadline Job Error]:', error.message);
  }
};

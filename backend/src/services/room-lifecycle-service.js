import { Room } from '../models/Room.js';
import { ROOM_STATUS } from '../constants/room-status.js';

export const validateStatusTransition = (currentStatus, newStatus) => {
  const allowed = {
    [ROOM_STATUS.DRAFT]: [ROOM_STATUS.OPEN, ROOM_STATUS.CANCELLED],
    [ROOM_STATUS.OPEN]: [
      ROOM_STATUS.FULL,
      ROOM_STATUS.IN_PROGRESS,
      ROOM_STATUS.EXPIRED,
      ROOM_STATUS.CANCELLED,
    ],
    [ROOM_STATUS.FULL]: [ROOM_STATUS.OPEN, ROOM_STATUS.IN_PROGRESS, ROOM_STATUS.CANCELLED],
    [ROOM_STATUS.IN_PROGRESS]: [ROOM_STATUS.COMPLETED, ROOM_STATUS.CANCELLED],
    [ROOM_STATUS.COMPLETED]: [],
    [ROOM_STATUS.EXPIRED]: [ROOM_STATUS.OPEN, ROOM_STATUS.CANCELLED],
    [ROOM_STATUS.CANCELLED]: [],
  };

  return allowed[currentStatus]?.includes(newStatus) || false;
};

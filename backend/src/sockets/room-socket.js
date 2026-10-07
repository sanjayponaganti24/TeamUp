import { emitToUser, emitToRoom } from './socket.js';

export const registerRoomSocketHandlers = (socket) => {
  socket.on('subscribe-room', (roomId) => {
    socket.join(`room:${roomId}`);
  });

  socket.on('unsubscribe-room', (roomId) => {
    socket.leave(`room:${roomId}`);
  });
};

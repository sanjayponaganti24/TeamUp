import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('[Socket Client] Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket Client] Disconnected from server');
    });
  }
  return socket;
};

export const joinUserChannel = (userId) => {
  const s = getSocket();
  if (s && userId) {
    s.emit('join-user', userId);
  }
};

export const joinRoomChannel = (roomId) => {
  const s = getSocket();
  if (s && roomId) {
    s.emit('join-room', roomId);
  }
};

export const leaveRoomChannel = (roomId) => {
  const s = getSocket();
  if (s && roomId) {
    s.emit('leave-room', roomId);
  }
};

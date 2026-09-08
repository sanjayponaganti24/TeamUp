import { Server } from 'socket.io';
import { ENV } from '../config/env.js';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('join-user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket] User ${userId} joined room user:${userId}`);
      }
    });

    socket.on('join-room', (roomId) => {
      if (roomId) {
        socket.join(`room:${roomId}`);
        console.log(`[Socket] Socket ${socket.id} joined room:${roomId}`);
      }
    });

    socket.on('leave-room', (roomId) => {
      if (roomId) {
        socket.leave(`room:${roomId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

export const emitToUser = (userId, eventName, payload) => {
  if (io && userId) {
    io.to(`user:${userId.toString()}`).emit(eventName, payload);
  }
};

export const emitToRoom = (roomId, eventName, payload) => {
  if (io && roomId) {
    io.to(`room:${roomId.toString()}`).emit(eventName, payload);
  }
};

export const emitGlobal = (eventName, payload) => {
  if (io) {
    io.emit(eventName, payload);
  }
};

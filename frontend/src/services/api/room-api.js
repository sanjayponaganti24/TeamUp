import api from './axios.js';

export const createRoom = async (roomData) => {
  const res = await api.post('/room-api', roomData);
  return res.data;
};

export const getRooms = async (params = {}) => {
  const res = await api.get('/room-api', { params });
  return res.data;
};

export const getRoomById = async (roomId) => {
  const res = await api.get(`/room-api/${roomId}`);
  return res.data;
};

export const updateRoom = async (roomId, roomData) => {
  const res = await api.put(`/room-api/${roomId}`, roomData);
  return res.data;
};

export const updateRoomStatus = async (roomId, status) => {
  const res = await api.patch(`/room-api/${roomId}/status`, { status });
  return res.data;
};

export const leaveRoom = async (roomId) => {
  const res = await api.post(`/room-api/${roomId}/leave`);
  return res.data;
};

export const getMyRooms = async () => {
  const res = await api.get('/room-api/my-rooms');
  return res.data;
};

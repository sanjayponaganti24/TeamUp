import api from './axios.js';

export const createRoomUpdate = async (roomId, data) => {
  const res = await api.post(`/room-update-api/${roomId}`, data);
  return res.data;
};

export const getRoomUpdates = async (roomId) => {
  const res = await api.get(`/room-update-api/${roomId}`);
  return res.data;
};

export const deleteRoomUpdate = async (updateId) => {
  const res = await api.delete(`/room-update-api/${updateId}`);
  return res.data;
};

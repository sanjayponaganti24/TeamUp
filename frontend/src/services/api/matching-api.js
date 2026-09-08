import api from './axios.js';

export const getRecommendedRooms = async (params = {}) => {
  const res = await api.get('/matching-api/rooms', { params });
  return res.data;
};

export const getRecommendedStudents = async (roomId, params = {}) => {
  const res = await api.get(`/matching-api/students/${roomId}`, { params });
  return res.data;
};

export const getMatchScore = async (roomId, studentId) => {
  const res = await api.get('/matching-api/score', {
    params: { roomId, studentId },
  });
  return res.data;
};

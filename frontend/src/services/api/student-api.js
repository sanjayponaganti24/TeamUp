import api from './axios.js';

export const getProfile = async () => {
  const res = await api.get('/student-api/profile');
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put('/student-api/profile', profileData);
  return res.data;
};

export const getAllStudents = async (params = {}) => {
  const res = await api.get('/student-api/all', { params });
  return res.data;
};

export const getStudentById = async (studentId) => {
  const res = await api.get(`/student-api/${studentId}`);
  return res.data;
};

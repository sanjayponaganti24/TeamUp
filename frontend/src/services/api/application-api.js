import api from './axios.js';

export const applyToRoom = async (data) => {
  const res = await api.post('/application-api', data);
  return res.data;
};

export const getMyApplications = async () => {
  const res = await api.get('/application-api/my-applications');
  return res.data;
};

export const getRoomApplications = async (roomId) => {
  const res = await api.get(`/application-api/room/${roomId}`);
  return res.data;
};

export const reviewApplication = async (applicationId, data) => {
  const res = await api.patch(`/application-api/${applicationId}/review`, data);
  return res.data;
};

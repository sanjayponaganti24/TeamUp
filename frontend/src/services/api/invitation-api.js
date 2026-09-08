import api from './axios.js';

export const inviteStudent = async (data) => {
  const res = await api.post('/invitation-api', data);
  return res.data;
};

export const getMyInvitations = async () => {
  const res = await api.get('/invitation-api/my-invitations');
  return res.data;
};

export const getRoomInvitations = async (roomId) => {
  const res = await api.get(`/invitation-api/room/${roomId}`);
  return res.data;
};

export const respondToInvitation = async (invitationId, status) => {
  const res = await api.patch(`/invitation-api/${invitationId}/respond`, { status });
  return res.data;
};

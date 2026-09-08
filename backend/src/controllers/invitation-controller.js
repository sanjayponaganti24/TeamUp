import * as invitationService from '../services/invitation-service.js';
import { sendSuccess } from '../utils/response.js';

export const invite = async (req, res, next) => {
  try {
    const invitation = await invitationService.inviteStudent(req.user._id, req.body);
    return sendSuccess(res, 201, 'Invitation sent successfully', invitation);
  } catch (error) {
    next(error);
  }
};

export const respond = async (req, res, next) => {
  try {
    const result = await invitationService.respondToInvitation(
      req.user._id,
      req.params.id,
      req.body
    );
    return sendSuccess(res, 200, 'Invitation response recorded', result);
  } catch (error) {
    next(error);
  }
};

export const getMyInvitations = async (req, res, next) => {
  try {
    const data = await invitationService.getMyInvitations(req.user._id);
    return sendSuccess(res, 200, 'My invitations retrieved', data);
  } catch (error) {
    next(error);
  }
};

export const getRoomInvitations = async (req, res, next) => {
  try {
    const data = await invitationService.getRoomInvitations(req.user._id, req.params.roomId);
    return sendSuccess(res, 200, 'Room invitations retrieved', data);
  } catch (error) {
    next(error);
  }
};

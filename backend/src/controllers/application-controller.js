import * as applicationService from '../services/application-service.js';
import { sendSuccess } from '../utils/response.js';

export const apply = async (req, res, next) => {
  try {
    const application = await applicationService.applyToRoom(req.user._id, req.body);
    return sendSuccess(res, 201, 'Application submitted successfully', application);
  } catch (error) {
    next(error);
  }
};

export const review = async (req, res, next) => {
  try {
    const updated = await applicationService.reviewApplication(
      req.user._id,
      req.params.id,
      req.body
    );
    return sendSuccess(res, 200, 'Application reviewed successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const getRoomApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getRoomApplications(
      req.user._id,
      req.params.roomId
    );
    return sendSuccess(res, 200, 'Room applications retrieved', applications);
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getMyApplications(req.user._id);
    return sendSuccess(res, 200, 'My applications retrieved', applications);
  } catch (error) {
    next(error);
  }
};

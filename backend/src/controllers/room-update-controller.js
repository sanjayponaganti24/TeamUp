import * as roomUpdateService from '../services/room-update-service.js';
import { sendSuccess } from '../utils/response.js';

export const createUpdate = async (req, res, next) => {
  try {
    const update = await roomUpdateService.createRoomUpdate(
      req.user._id,
      req.params.roomId,
      req.body
    );
    return sendSuccess(res, 201, 'Team update posted', update);
  } catch (error) {
    next(error);
  }
};

export const getUpdates = async (req, res, next) => {
  try {
    const updates = await roomUpdateService.getRoomUpdates(req.params.roomId);
    return sendSuccess(res, 200, 'Room updates retrieved', updates);
  } catch (error) {
    next(error);
  }
};

export const deleteUpdate = async (req, res, next) => {
  try {
    await roomUpdateService.deleteRoomUpdate(req.user._id, req.params.id);
    return sendSuccess(res, 200, 'Update deleted successfully');
  } catch (error) {
    next(error);
  }
};

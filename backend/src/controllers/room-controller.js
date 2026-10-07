import * as roomService from '../services/room-service.js';
import { sendSuccess } from '../utils/response.js';

export const create = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.user._id, req.body);
    return sendSuccess(res, 201, 'Room created successfully', room);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await roomService.getRooms(req.query);
    return sendSuccess(res, 200, 'Rooms retrieved', data);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    return sendSuccess(res, 200, 'Room retrieved', room);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const updated = await roomService.updateRoom(req.params.id, req.user._id, req.body);
    return sendSuccess(res, 200, 'Room updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const updated = await roomService.updateRoomStatus(req.params.id, req.user._id, req.body.status);
    return sendSuccess(res, 200, 'Room status updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const leave = async (req, res, next) => {
  try {
    const result = await roomService.leaveRoom(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Left room successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getMyRooms = async (req, res, next) => {
  try {
    const data = await roomService.getMyRooms(req.user._id);
    return sendSuccess(res, 200, 'My rooms retrieved', data);
  } catch (error) {
    next(error);
  }
};

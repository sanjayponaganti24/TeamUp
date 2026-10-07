import { Router } from 'express';
import * as roomController from '../controllers/room-controller.js';
import { protect, optionalAuth } from '../middleware/auth-middleware.js';
import { validate } from '../middleware/validation-middleware.js';
import {
  createRoomSchema,
  updateRoomSchema,
  updateRoomStatusSchema,
} from '../validators/room-validator.js';

const router = Router();

router.post('/', protect, validate(createRoomSchema), roomController.create);
router.get('/', optionalAuth, roomController.getAll);
router.get('/my-rooms', protect, roomController.getMyRooms);
router.get('/:id', optionalAuth, roomController.getById);
router.put('/:id', protect, validate(updateRoomSchema), roomController.update);
router.patch('/:id/status', protect, validate(updateRoomStatusSchema), roomController.updateStatus);
router.post('/:id/leave', protect, roomController.leave);

export default router;

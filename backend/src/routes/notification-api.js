import { Router } from 'express';
import * as notificationController from '../controllers/notification-controller.js';
import { protect } from '../middleware/auth-middleware.js';

const router = Router();

router.get('/', protect, notificationController.getNotifications);
router.patch('/read-all', protect, notificationController.markAllAsRead);
router.patch('/:id/read', protect, notificationController.markAsRead);

export default router;

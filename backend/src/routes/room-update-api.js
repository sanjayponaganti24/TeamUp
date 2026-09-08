import { Router } from 'express';
import * as roomUpdateController from '../controllers/room-update-controller.js';
import { protect } from '../middleware/auth-middleware.js';

const router = Router();

router.post('/:roomId', protect, roomUpdateController.createUpdate);
router.get('/:roomId', protect, roomUpdateController.getUpdates);
router.delete('/:id', protect, roomUpdateController.deleteUpdate);

export default router;

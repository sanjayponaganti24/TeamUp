import { Router } from 'express';
import * as matchingController from '../controllers/matching-controller.js';
import { protect } from '../middleware/auth-middleware.js';

const router = Router();

router.get('/rooms', protect, matchingController.getRecommendedRooms);
router.get('/students/:roomId', protect, matchingController.getRecommendedStudents);
router.get('/score', protect, matchingController.getMatchScore);

export default router;

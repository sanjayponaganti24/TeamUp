import { Router } from 'express';
import * as recommendationController from '../controllers/recommendation-controller.js';
import { protect } from '../middleware/auth-middleware.js';

const router = Router();

router.get('/rooms', protect, recommendationController.getRecommendedRooms);
router.get('/students/:roomId', protect, recommendationController.getRecommendedStudents);
router.get('/score', protect, recommendationController.getMatchScore);

export default router;

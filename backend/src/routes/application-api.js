import { Router } from 'express';
import * as applicationController from '../controllers/application-controller.js';
import { protect } from '../middleware/auth-middleware.js';
import { validate } from '../middleware/validation-middleware.js';
import {
  createApplicationSchema,
  reviewApplicationSchema,
} from '../validators/application-validator.js';

const router = Router();

router.post('/', protect, validate(createApplicationSchema), applicationController.apply);
router.get('/my-applications', protect, applicationController.getMyApplications);
router.get('/room/:roomId', protect, applicationController.getRoomApplications);
router.patch(
  '/:id/review',
  protect,
  validate(reviewApplicationSchema),
  applicationController.review
);

export default router;

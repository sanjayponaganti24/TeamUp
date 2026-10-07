import { Router } from 'express';
import * as invitationController from '../controllers/invitation-controller.js';
import { protect } from '../middleware/auth-middleware.js';
import { validate } from '../middleware/validation-middleware.js';
import {
  createInvitationSchema,
  respondInvitationSchema,
} from '../validators/invitation-validator.js';

const router = Router();

router.post('/', protect, validate(createInvitationSchema), invitationController.invite);
router.get('/my-invitations', protect, invitationController.getMyInvitations);
router.get('/room/:roomId', protect, invitationController.getRoomInvitations);
router.patch(
  '/:id/respond',
  protect,
  validate(respondInvitationSchema),
  invitationController.respond
);

export default router;

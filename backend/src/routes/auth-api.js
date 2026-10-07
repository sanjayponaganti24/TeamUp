import { Router } from 'express';
import * as authController from '../controllers/auth-controller.js';
import { protect } from '../middleware/auth-middleware.js';
import { validate } from '../middleware/validation-middleware.js';
import { registerSchema, loginSchema } from '../validators/auth-validator.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;

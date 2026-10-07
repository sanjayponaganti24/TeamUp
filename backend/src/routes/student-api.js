import { Router } from 'express';
import * as studentController from '../controllers/student-controller.js';
import { protect, optionalAuth } from '../middleware/auth-middleware.js';
import { validate } from '../middleware/validation-middleware.js';
import { updateStudentProfileSchema } from '../validators/student-validator.js';

const router = Router();

router.get('/profile', protect, studentController.getProfile);
router.put('/profile', protect, validate(updateStudentProfileSchema), studentController.updateProfile);
router.get('/all', optionalAuth, studentController.getAllStudents);
router.get('/:id', optionalAuth, studentController.getStudentById);

export default router;

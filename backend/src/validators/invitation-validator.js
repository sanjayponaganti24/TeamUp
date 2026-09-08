import { z } from 'zod';

export const createInvitationSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  role: z.string().optional().default('Member'),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional().default(''),
});

export const respondInvitationSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
});

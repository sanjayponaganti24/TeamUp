import { z } from 'zod';

export const createApplicationSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional().default(''),
  requestedRole: z.string().optional().default('Member'),
});

export const reviewApplicationSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
  reviewerFeedback: z.string().optional().default(''),
});

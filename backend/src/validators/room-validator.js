import { z } from 'zod';
import { ROOM_TYPES_LIST } from '../constants/room-types.js';
import { ROOM_STATUS_LIST } from '../constants/room-status.js';

export const createRoomSchema = z.object({
  name: z.string().min(3, 'Room name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(ROOM_TYPES_LIST),
  capacity: z.coerce.number().min(2, 'Capacity must be at least 2').max(20, 'Capacity cannot exceed 20'),
  requiredBranches: z.array(z.string()).optional().default([]),
  requiredSkills: z.array(z.string()).optional().default([]),
  requiredRoles: z.array(z.string()).optional().default([]),
  deadline: z.string().or(z.date()),
  startDate: z.string().or(z.date()).optional().nullable(),
  endDate: z.string().or(z.date()).optional().nullable(),
  autoAccept: z.boolean().optional().default(false),
  typeDetails: z.record(z.any()).optional().default({}),
});

export const updateRoomSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  capacity: z.coerce.number().min(2).max(20).optional(),
  requiredBranches: z.array(z.string()).optional(),
  requiredSkills: z.array(z.string()).optional(),
  requiredRoles: z.array(z.string()).optional(),
  deadline: z.string().or(z.date()).optional(),
  startDate: z.string().or(z.date()).optional().nullable(),
  endDate: z.string().or(z.date()).optional().nullable(),
  autoAccept: z.boolean().optional(),
  typeDetails: z.record(z.any()).optional(),
});

export const updateRoomStatusSchema = z.object({
  status: z.enum(ROOM_STATUS_LIST),
});

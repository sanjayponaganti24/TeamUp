import { z } from 'zod';
import { AVAILABILITY_STATUS_LIST } from '../constants/availability-status.js';

export const updateStudentProfileSchema = z.object({
  name: z.string().min(2).optional(),
  branch: z.string().optional(),
  year: z.coerce.number().min(1).max(5).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  preferredRoles: z.array(z.string()).optional(),
  availability: z.enum(AVAILABILITY_STATUS_LIST).optional(),
  bio: z.string().max(500).optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  projects: z
    .array(
      z.object({
        title: z.string().min(1, 'Project title is required'),
        description: z.string().optional(),
        link: z.string().optional(),
        role: z.string().optional(),
        techStack: z.array(z.string()).optional(),
      })
    )
    .optional(),
  experience: z
    .array(
      z.object({
        title: z.string().min(1, 'Role/Title is required'),
        organization: z.string().optional(),
        duration: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

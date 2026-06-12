import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { createAchievement, listAchievements, listMyAchievements } from './service.js';

const achievementSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
  icon_url: z.string().optional(),
  required_xp: z.number().int().optional(),
});

export const getAchievements = asyncHandler(async (_req, res) => {
  return sendSuccess(res, await listAchievements());
});

export const getAchievementsMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, await listMyAchievements(req.user!._id.toString()));
});

export const postAchievement = asyncHandler(async (req, res) => {
  return sendSuccess(res, await createAchievement(achievementSchema.parse(req.body)), 'Created', 201);
});

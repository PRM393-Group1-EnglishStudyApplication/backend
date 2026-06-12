import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { getAchievements, getAchievementsMe, postAchievement } from './controller.js';

export const achievementsRouter = Router();

achievementsRouter.get('/', getAchievements);
achievementsRouter.get('/me', requireAuth, getAchievementsMe);
achievementsRouter.post('/', postAchievement);

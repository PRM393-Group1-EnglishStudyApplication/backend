import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { getLeaderboard, getLeaderboardMe } from './controller.js';

export const leaderboardRouter = Router();

leaderboardRouter.get('/', getLeaderboard);
leaderboardRouter.get('/me', requireAuth, getLeaderboardMe);

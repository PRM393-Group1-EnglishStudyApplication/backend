import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { getHeartsMe, refillHearts } from './controller.js';

export const heartsRouter = Router();

heartsRouter.get('/me', requireAuth, getHeartsMe);
heartsRouter.post('/refill', requireAuth, refillHearts);

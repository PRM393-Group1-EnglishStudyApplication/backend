import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { me } from './controller.js';

export const authRouter = Router();

authRouter.get('/me', requireAuth, me);

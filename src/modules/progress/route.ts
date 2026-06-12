import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { getProgressMe, getProgressMeLesson } from './controller.js';

export const progressRouter = Router();

progressRouter.get('/me', requireAuth, getProgressMe);
progressRouter.get('/me/lessons/:lessonId', requireAuth, getProgressMeLesson);

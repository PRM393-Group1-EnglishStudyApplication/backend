import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import {
  getLessonById,
  getLessonsByUnit,
  postLesson,
  putLesson,
  removeLesson,
  submitLessonAnswers,
} from './controller.js';

export const lessonsRouter = Router();
export const unitLessonsRouter = Router({ mergeParams: true });

unitLessonsRouter.get('/', getLessonsByUnit);

lessonsRouter.get('/:id', getLessonById);
lessonsRouter.post('/', postLesson);
lessonsRouter.put('/:id', putLesson);
lessonsRouter.delete('/:id', removeLesson);
lessonsRouter.post('/:lessonId/submit', requireAuth, submitLessonAnswers);

import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware.js';
import {
  getExerciseById,
  getExercisesByLesson,
  postExercise,
  postExerciseOption,
  putExercise,
  putExerciseOption,
  removeExercise,
  removeExerciseOption,
  reorderOptions,
} from './controller.js';

export const exercisesRouter = Router();
export const lessonExercisesRouter = Router({ mergeParams: true });
export const exerciseOptionsRouter = Router();

const adminOnly = [requireAuth, requireRole('admin')];

lessonExercisesRouter.get('/', getExercisesByLesson);

exercisesRouter.get('/:id', getExerciseById);
exercisesRouter.post('/', ...adminOnly, postExercise);
exercisesRouter.put('/:id', ...adminOnly, putExercise);
exercisesRouter.delete('/:id', ...adminOnly, removeExercise);
exercisesRouter.post('/:exerciseId/options', ...adminOnly, postExerciseOption);
exercisesRouter.put('/:exerciseId/options/reorder', ...adminOnly, reorderOptions);

exerciseOptionsRouter.put('/:id', ...adminOnly, putExerciseOption);
exerciseOptionsRouter.delete('/:id', ...adminOnly, removeExerciseOption);

import { Router } from 'express';
import {
  getExerciseById,
  getExercisesByLesson,
  postExercise,
  postExerciseOption,
  putExercise,
  putExerciseOption,
  removeExercise,
  removeExerciseOption,
} from './controller.js';

export const exercisesRouter = Router();
export const lessonExercisesRouter = Router({ mergeParams: true });
export const exerciseOptionsRouter = Router();

lessonExercisesRouter.get('/', getExercisesByLesson);

exercisesRouter.get('/:id', getExerciseById);
exercisesRouter.post('/', postExercise);
exercisesRouter.put('/:id', putExercise);
exercisesRouter.delete('/:id', removeExercise);
exercisesRouter.post('/:exerciseId/options', postExerciseOption);

exerciseOptionsRouter.put('/:id', putExerciseOption);
exerciseOptionsRouter.delete('/:id', removeExerciseOption);

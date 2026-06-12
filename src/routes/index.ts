import { Router } from 'express';
import { sendSuccess } from '../utils/ApiResponse.js';
import { achievementsRouter } from '../modules/achievements/route.js';
import { authRouter } from '../modules/auth/route.js';
import { coursesRouter } from '../modules/courses/route.js';
import { exerciseOptionsRouter, exercisesRouter, lessonExercisesRouter } from '../modules/exercises/route.js';
import { heartsRouter } from '../modules/hearts/route.js';
import { leaderboardRouter } from '../modules/leaderboard/route.js';
import { lessonsRouter, unitLessonsRouter } from '../modules/lessons/route.js';
import { progressRouter } from '../modules/progress/route.js';
import { courseUnitsRouter, unitsRouter } from '../modules/units/route.js';
import { lessonVocabularyRouter, vocabularyRouter } from '../modules/vocabulary/route.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  return sendSuccess(
    res,
    {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    'API is healthy'
  );
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/courses/:courseId/units', courseUnitsRouter);
apiRouter.use('/courses', coursesRouter);
apiRouter.use('/units/:unitId/lessons', unitLessonsRouter);
apiRouter.use('/units', unitsRouter);
apiRouter.use('/lessons/:lessonId/vocabulary', lessonVocabularyRouter);
apiRouter.use('/lessons/:lessonId/exercises', lessonExercisesRouter);
apiRouter.use('/lessons', lessonsRouter);
apiRouter.use('/vocabulary', vocabularyRouter);
apiRouter.use('/exercises', exercisesRouter);
apiRouter.use('/exercise-options', exerciseOptionsRouter);
apiRouter.use('/progress', progressRouter);
apiRouter.use('/hearts', heartsRouter);
apiRouter.use('/achievements', achievementsRouter);
apiRouter.use('/leaderboard', leaderboardRouter);

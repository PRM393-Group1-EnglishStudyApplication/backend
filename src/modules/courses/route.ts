import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { getCourseById, getCourses, getRecommended, postCourse, putCourse, removeCourse } from './controller.js';

export const coursesRouter = Router();

coursesRouter.get('/', getCourses);
coursesRouter.get('/recommended', requireAuth, getRecommended);
coursesRouter.get('/:id', getCourseById);
coursesRouter.post('/', postCourse);
coursesRouter.put('/:id', putCourse);
coursesRouter.delete('/:id', removeCourse);

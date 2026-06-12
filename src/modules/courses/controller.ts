import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { userLevels, type UserLevel } from '../auth/model.js';
import { createCourse, deleteCourse, getCourseDetail, getRecommendedCourses, listCourses, updateCourse } from './service.js';

const courseSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().optional(),
  language_id: z.number().int(),
  target_level: z.enum(userLevels).optional(),
});

const updateCourseSchema = courseSchema.partial();

export const getCourses = asyncHandler(async (req, res) => {
  const targetLevel =
    typeof req.query.targetLevel === 'string' && userLevels.includes(req.query.targetLevel as UserLevel)
      ? (req.query.targetLevel as UserLevel)
      : undefined;
  return sendSuccess(res, await listCourses(targetLevel));
});

export const getRecommended = asyncHandler(async (req, res) => {
  return sendSuccess(res, await getRecommendedCourses(req.user!.current_level));
});

export const getCourseById = asyncHandler(async (req, res) => {
  return sendSuccess(res, await getCourseDetail(req.params.id));
});

export const postCourse = asyncHandler(async (req, res) => {
  return sendSuccess(res, await createCourse(courseSchema.parse(req.body)), 'Created', 201);
});

export const putCourse = asyncHandler(async (req, res) => {
  return sendSuccess(res, await updateCourse(req.params.id, updateCourseSchema.parse(req.body)));
});

export const removeCourse = asyncHandler(async (req, res) => {
  await deleteCourse(req.params.id);
  return sendSuccess(res, null, 'Deleted');
});

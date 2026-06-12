import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { toObjectId } from '../../utils/mongo.js';
import { createLesson, deleteLesson, getLessonDetail, listLessonsByUnit, submitLesson, updateLesson } from './service.js';

const lessonSchema = z.object({
  unit_id: z.string().transform((id) => toObjectId(id, 'unit_id')),
  title: z.string().trim().min(1),
  order_index: z.number().int(),
  xp_reward: z.number().int().default(10),
});

const updateLessonSchema = lessonSchema.partial();

const submitSchema = z.object({
  answers: z.array(
    z.object({
      exerciseId: z.string().min(1),
      userAnswer: z.string().optional(),
    })
  ),
});

export const getLessonsByUnit = asyncHandler(async (req, res) => {
  return sendSuccess(res, await listLessonsByUnit(req.params.unitId));
});

export const getLessonById = asyncHandler(async (req, res) => {
  return sendSuccess(res, await getLessonDetail(req.params.id));
});

export const postLesson = asyncHandler(async (req, res) => {
  return sendSuccess(res, await createLesson(lessonSchema.parse(req.body)), 'Created', 201);
});

export const putLesson = asyncHandler(async (req, res) => {
  return sendSuccess(res, await updateLesson(req.params.id, updateLessonSchema.parse(req.body)));
});

export const removeLesson = asyncHandler(async (req, res) => {
  await deleteLesson(req.params.id);
  return sendSuccess(res, null, 'Deleted');
});

export const submitLessonAnswers = asyncHandler(async (req, res) => {
  const payload = submitSchema.parse(req.body);
  return sendSuccess(res, await submitLesson(req.user!, req.params.lessonId, payload.answers));
});

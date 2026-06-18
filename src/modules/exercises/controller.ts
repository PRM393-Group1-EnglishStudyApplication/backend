import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { toObjectId } from '../../utils/mongo.js';
import { exerciseTypes } from './model.js';
import {
  createExercise,
  createExerciseOption,
  deleteExercise,
  deleteExerciseOption,
  getExerciseDetail,
  listExercisesWithOptions,
  reorderExerciseOptions,
  updateExercise,
  updateExerciseOption,
} from './service.js';

const optionSchema = z.object({
  exercise_id: z.string().optional().transform((id) => (id ? toObjectId(id, 'exercise_id') : undefined)),
  option_text: z.string().trim().min(1),
  is_correct: z.boolean().default(false),
});

const exerciseSchema = z.object({
  lesson_id: z.string().transform((id) => toObjectId(id, 'lesson_id')),
  question: z.string().trim().min(1),
  exercise_type: z.enum(exerciseTypes),
  correct_answer: z.string().trim().min(1),
  audio_url: z.string().optional(),
  image_url: z.string().optional(),
  order_index: z.number().int().optional(),
  options: z.array(optionSchema.omit({ exercise_id: true })).optional(),
});

const updateExerciseSchema = exerciseSchema.omit({ options: true }).partial();
const updateOptionSchema = optionSchema.partial();

const reorderOptionsSchema = z.object({
  order: z.array(z.string().min(1)).min(1),
});

export const getExercisesByLesson = asyncHandler(async (req, res) => {
  return sendSuccess(res, await listExercisesWithOptions(req.params.lessonId));
});

export const getExerciseById = asyncHandler(async (req, res) => {
  return sendSuccess(res, await getExerciseDetail(req.params.id));
});

export const postExercise = asyncHandler(async (req, res) => {
  const { options, ...exercise } = exerciseSchema.parse(req.body);
  return sendSuccess(res, await createExercise(exercise, options ?? []), 'Created', 201);
});

export const putExercise = asyncHandler(async (req, res) => {
  return sendSuccess(res, await updateExercise(req.params.id, updateExerciseSchema.parse(req.body)));
});

export const removeExercise = asyncHandler(async (req, res) => {
  await deleteExercise(req.params.id);
  return sendSuccess(res, null, 'Deleted');
});

export const postExerciseOption = asyncHandler(async (req, res) => {
  const body = optionSchema.omit({ exercise_id: true }).parse(req.body);
  return sendSuccess(
    res,
    await createExerciseOption({ ...body, exercise_id: toObjectId(req.params.exerciseId, 'exerciseId') }),
    'Created',
    201
  );
});

export const putExerciseOption = asyncHandler(async (req, res) => {
  return sendSuccess(res, await updateExerciseOption(req.params.id, updateOptionSchema.parse(req.body)));
});

export const reorderOptions = asyncHandler(async (req, res) => {
  const { order } = reorderOptionsSchema.parse(req.body);
  return sendSuccess(res, await reorderExerciseOptions(req.params.exerciseId, order), 'Reordered');
});

export const removeExerciseOption = asyncHandler(async (req, res) => {
  await deleteExerciseOption(req.params.id);
  return sendSuccess(res, null, 'Deleted');
});

import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { toObjectId } from '../../utils/mongo.js';
import { createUnit, deleteUnit, listUnitsByCourse, updateUnit } from './service.js';

const unitSchema = z.object({
  course_id: z.string().transform((id) => toObjectId(id, 'course_id')),
  title: z.string().trim().min(1),
  order_index: z.number().int(),
});

const updateUnitSchema = unitSchema.partial();

export const getUnitsByCourse = asyncHandler(async (req, res) => {
  return sendSuccess(res, await listUnitsByCourse(req.params.courseId));
});

export const postUnit = asyncHandler(async (req, res) => {
  return sendSuccess(res, await createUnit(unitSchema.parse(req.body)), 'Created', 201);
});

export const putUnit = asyncHandler(async (req, res) => {
  return sendSuccess(res, await updateUnit(req.params.id, updateUnitSchema.parse(req.body)));
});

export const removeUnit = asyncHandler(async (req, res) => {
  await deleteUnit(req.params.id);
  return sendSuccess(res, null, 'Deleted');
});

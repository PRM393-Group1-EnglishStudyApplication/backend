import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import {
  attachVocabularyToLesson,
  createVocabulary,
  deleteVocabulary,
  detachVocabularyFromLesson,
  getVocabulary,
  listVocabulary,
  updateVocabulary,
} from './service.js';

const vocabularySchema = z.object({
  word: z.string().trim().min(1),
  meaning: z.string().trim().min(1),
  pronunciation: z.string().optional(),
  example_sentence: z.string().optional(),
  image_url: z.string().optional(),
  audio_url: z.string().optional(),
});

const updateVocabularySchema = vocabularySchema.partial();

export const getVocabularyList = asyncHandler(async (_req, res) => {
  return sendSuccess(res, await listVocabulary());
});

export const getVocabularyById = asyncHandler(async (req, res) => {
  return sendSuccess(res, await getVocabulary(req.params.id));
});

export const postVocabulary = asyncHandler(async (req, res) => {
  return sendSuccess(res, await createVocabulary(vocabularySchema.parse(req.body)), 'Created', 201);
});

export const putVocabulary = asyncHandler(async (req, res) => {
  return sendSuccess(res, await updateVocabulary(req.params.id, updateVocabularySchema.parse(req.body)));
});

export const removeVocabulary = asyncHandler(async (req, res) => {
  await deleteVocabulary(req.params.id);
  return sendSuccess(res, null, 'Deleted');
});

export const attachToLesson = asyncHandler(async (req, res) => {
  return sendSuccess(
    res,
    await attachVocabularyToLesson(req.params.lessonId, req.params.vocabularyId),
    'Attached',
    201
  );
});

export const detachFromLesson = asyncHandler(async (req, res) => {
  await detachVocabularyFromLesson(req.params.lessonId, req.params.vocabularyId);
  return sendSuccess(res, null, 'Detached');
});

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { getMyLessonProgress, getMyProgress } from './service.js';

export const getProgressMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, await getMyProgress(req.user!._id.toString()));
});

export const getProgressMeLesson = asyncHandler(async (req, res) => {
  return sendSuccess(res, await getMyLessonProgress(req.user!._id.toString(), req.params.lessonId));
});

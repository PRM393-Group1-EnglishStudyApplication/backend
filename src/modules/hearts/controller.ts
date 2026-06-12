import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { getMyHearts, refillMyHearts } from './service.js';

export const getHeartsMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, await getMyHearts(req.user!._id.toString()));
});

export const refillHearts = asyncHandler(async (req, res) => {
  return sendSuccess(res, await refillMyHearts(req.user!._id.toString()), 'Refilled');
});

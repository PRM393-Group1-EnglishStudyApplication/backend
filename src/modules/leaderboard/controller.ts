import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { getCurrentLeaderboard, getMyLeaderboard } from './service.js';

export const getLeaderboard = asyncHandler(async (_req, res) => {
  return sendSuccess(res, await getCurrentLeaderboard());
});

export const getLeaderboardMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, await getMyLeaderboard(req.user!._id.toString()));
});

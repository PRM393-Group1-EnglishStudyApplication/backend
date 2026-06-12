import { sendSuccess } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { toSafeUser } from './model.js';

export const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, toSafeUser(req.user!), 'Success');
});

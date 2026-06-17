import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { addFavorite, listMyFavorites, removeFavorite } from './service.js';

export const getFavoritesMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, await listMyFavorites(req.user!._id.toString()));
});

export const postFavorite = asyncHandler(async (req, res) => {
  return sendSuccess(
    res,
    await addFavorite(req.user!._id.toString(), req.params.vocabularyId),
    'Added to favorites',
    201
  );
});

export const removeFavoriteVocabulary = asyncHandler(async (req, res) => {
  await removeFavorite(req.user!._id.toString(), req.params.vocabularyId);
  return sendSuccess(res, null, 'Removed from favorites');
});

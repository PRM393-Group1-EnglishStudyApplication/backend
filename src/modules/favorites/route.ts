import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { getFavoritesMe, postFavorite, removeFavoriteVocabulary } from './controller.js';

export const favoritesRouter = Router();

favoritesRouter.get('/me', requireAuth, getFavoritesMe);
favoritesRouter.post('/:vocabularyId', requireAuth, postFavorite);
favoritesRouter.delete('/:vocabularyId', requireAuth, removeFavoriteVocabulary);

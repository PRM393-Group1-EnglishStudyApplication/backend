import { ApiError } from '../../utils/ApiError.js';
import { toObjectId } from '../../utils/mongo.js';
import { VocabularyModel } from '../vocabulary/model.js';
import { UserFavoriteVocabularyModel } from './model.js';

// Danh sach tu vung yeu thich cua user, kem chi tiet tu vung
export async function listMyFavorites(userId: string) {
  const favorites = await UserFavoriteVocabularyModel.find({
    user_id: toObjectId(userId, 'userId'),
  })
    .sort({ created_at: -1 })
    .lean();

  const vocabularies = await VocabularyModel.find({
    _id: { $in: favorites.map((item) => item.vocabulary_id) },
  }).lean();

  return favorites.map((item) => ({
    ...item,
    vocabulary:
      vocabularies.find((vocab) => vocab._id.toString() === item.vocabulary_id.toString()) ?? null,
  }));
}

// Danh dau yeu thich mot tu vung (idempotent)
export async function addFavorite(userId: string, vocabularyId: string) {
  const userObjectId = toObjectId(userId, 'userId');
  const vocabularyObjectId = toObjectId(vocabularyId, 'vocabularyId');

  const vocabulary = await VocabularyModel.findById(vocabularyObjectId).lean();
  if (!vocabulary) {
    throw ApiError.notFound('Vocabulary khong ton tai.');
  }

  return UserFavoriteVocabularyModel.findOneAndUpdate(
    { user_id: userObjectId, vocabulary_id: vocabularyObjectId },
    { $setOnInsert: { user_id: userObjectId, vocabulary_id: vocabularyObjectId } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

// Bo danh dau yeu thich
export async function removeFavorite(userId: string, vocabularyId: string) {
  const result = await UserFavoriteVocabularyModel.findOneAndDelete({
    user_id: toObjectId(userId, 'userId'),
    vocabulary_id: toObjectId(vocabularyId, 'vocabularyId'),
  });
  if (!result) {
    throw ApiError.notFound('Favorite vocabulary khong ton tai.');
  }
  return result;
}

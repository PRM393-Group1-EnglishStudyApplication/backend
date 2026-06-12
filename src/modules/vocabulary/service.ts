import { ApiError } from '../../utils/ApiError.js';
import { toObjectId } from '../../utils/mongo.js';
import { LessonVocabularyModel, VocabularyModel, type IVocabulary } from './model.js';

export function listVocabulary() {
  return VocabularyModel.find().sort({ word: 1 }).lean();
}

export async function getVocabulary(id: string) {
  const vocabulary = await VocabularyModel.findById(toObjectId(id)).lean();
  if (!vocabulary) {
    throw ApiError.notFound('Vocabulary khong ton tai.');
  }
  return vocabulary;
}

export function createVocabulary(payload: IVocabulary) {
  return VocabularyModel.create(payload);
}

export async function updateVocabulary(id: string, payload: Partial<IVocabulary>) {
  const vocabulary = await VocabularyModel.findByIdAndUpdate(toObjectId(id), payload, {
    new: true,
    runValidators: true,
  });
  if (!vocabulary) {
    throw ApiError.notFound('Vocabulary khong ton tai.');
  }
  return vocabulary;
}

export async function deleteVocabulary(id: string) {
  const vocabularyId = toObjectId(id);
  const vocabulary = await VocabularyModel.findByIdAndDelete(vocabularyId);
  if (!vocabulary) {
    throw ApiError.notFound('Vocabulary khong ton tai.');
  }
  await LessonVocabularyModel.deleteMany({ vocabulary_id: vocabularyId });
  return vocabulary;
}

export function attachVocabularyToLesson(lessonId: string, vocabularyId: string) {
  return LessonVocabularyModel.create({
    lesson_id: toObjectId(lessonId, 'lessonId'),
    vocabulary_id: toObjectId(vocabularyId, 'vocabularyId'),
  });
}

export async function detachVocabularyFromLesson(lessonId: string, vocabularyId: string) {
  const result = await LessonVocabularyModel.findOneAndDelete({
    lesson_id: toObjectId(lessonId, 'lessonId'),
    vocabulary_id: toObjectId(vocabularyId, 'vocabularyId'),
  });
  if (!result) {
    throw ApiError.notFound('Lesson vocabulary khong ton tai.');
  }
  return result;
}

import { Router } from 'express';
import {
  attachToLesson,
  detachFromLesson,
  getVocabularyById,
  getVocabularyList,
  postVocabulary,
  putVocabulary,
  removeVocabulary,
} from './controller.js';

export const vocabularyRouter = Router();
export const lessonVocabularyRouter = Router({ mergeParams: true });

vocabularyRouter.get('/', getVocabularyList);
vocabularyRouter.get('/:id', getVocabularyById);
vocabularyRouter.post('/', postVocabulary);
vocabularyRouter.put('/:id', putVocabulary);
vocabularyRouter.delete('/:id', removeVocabulary);

lessonVocabularyRouter.post('/:vocabularyId', attachToLesson);
lessonVocabularyRouter.delete('/:vocabularyId', detachFromLesson);

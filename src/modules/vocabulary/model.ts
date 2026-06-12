import { Schema, model, type Types } from 'mongoose';

export interface IVocabulary {
  word: string;
  meaning: string;
  pronunciation?: string;
  example_sentence?: string;
  image_url?: string;
  audio_url?: string;
}

export interface ILessonVocabulary {
  lesson_id: Types.ObjectId;
  vocabulary_id: Types.ObjectId;
}

const vocabularySchema = new Schema<IVocabulary>(
  {
    word: { type: String, required: true, trim: true },
    meaning: { type: String, required: true, trim: true },
    pronunciation: { type: String },
    example_sentence: { type: String },
    image_url: { type: String },
    audio_url: { type: String },
  },
  { versionKey: false }
);

const lessonVocabularySchema = new Schema<ILessonVocabulary>(
  {
    lesson_id: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    vocabulary_id: { type: Schema.Types.ObjectId, ref: 'Vocabulary', required: true },
  },
  { versionKey: false }
);

lessonVocabularySchema.index({ lesson_id: 1, vocabulary_id: 1 }, { unique: true });

export const VocabularyModel = model<IVocabulary>('Vocabulary', vocabularySchema, 'vocabulary');
export const LessonVocabularyModel = model<ILessonVocabulary>(
  'LessonVocabulary',
  lessonVocabularySchema,
  'lesson_vocabulary'
);

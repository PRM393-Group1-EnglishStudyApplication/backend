import { Schema, model, type Types } from 'mongoose';

export const exerciseTypes = ['multiple_choice', 'translate', 'listening', 'fill_blank', 'matching'] as const;
export type ExerciseType = (typeof exerciseTypes)[number];

export interface IExercise {
  lesson_id: Types.ObjectId;
  question: string;
  exercise_type: ExerciseType;
  correct_answer: string;
  audio_url?: string;
  image_url?: string;
  order_index?: number;
}

export interface IExerciseOption {
  exercise_id: Types.ObjectId;
  option_text: string;
  is_correct: boolean;
  order_index?: number;
}

const exerciseSchema = new Schema<IExercise>(
  {
    lesson_id: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    question: { type: String, required: true, trim: true },
    exercise_type: { type: String, enum: exerciseTypes, required: true },
    correct_answer: { type: String, required: true },
    audio_url: { type: String },
    image_url: { type: String },
    order_index: { type: Number },
  },
  { versionKey: false }
);

const exerciseOptionSchema = new Schema<IExerciseOption>(
  {
    exercise_id: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    option_text: { type: String, required: true },
    is_correct: { type: Boolean, default: false },
    order_index: { type: Number },
  },
  { versionKey: false }
);

exerciseSchema.index({ lesson_id: 1, order_index: 1 });
exerciseOptionSchema.index({ exercise_id: 1, order_index: 1 });

export const ExerciseModel = model<IExercise>('Exercise', exerciseSchema, 'exercises');
export const ExerciseOptionModel = model<IExerciseOption>(
  'ExerciseOption',
  exerciseOptionSchema,
  'exercise_options'
);

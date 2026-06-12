import { Schema, model, type Types } from 'mongoose';

export interface IUserProgress {
  user_id: Types.ObjectId;
  lesson_id: Types.ObjectId;
  is_completed: boolean;
  score: number;
  earned_xp: number;
  completed_at?: Date;
}

export interface IUserExerciseAnswer {
  user_id: Types.ObjectId;
  exercise_id: Types.ObjectId;
  user_answer?: string;
  is_correct?: boolean;
  answered_at?: Date;
}

const userProgressSchema = new Schema<IUserProgress>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lesson_id: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    is_completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    earned_xp: { type: Number, default: 0 },
    completed_at: { type: Date },
  },
  { versionKey: false }
);

const userExerciseAnswerSchema = new Schema<IUserExerciseAnswer>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exercise_id: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    user_answer: { type: String },
    is_correct: { type: Boolean },
    answered_at: { type: Date },
  },
  { versionKey: false }
);

userProgressSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });
userExerciseAnswerSchema.index({ user_id: 1, exercise_id: 1 });

export const UserProgressModel = model<IUserProgress>('UserProgress', userProgressSchema, 'user_progress');
export const UserExerciseAnswerModel = model<IUserExerciseAnswer>(
  'UserExerciseAnswer',
  userExerciseAnswerSchema,
  'user_exercise_answers'
);

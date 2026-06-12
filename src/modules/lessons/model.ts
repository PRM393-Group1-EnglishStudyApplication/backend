import { Schema, model, type Types } from 'mongoose';

export interface ILesson {
  unit_id: Types.ObjectId;
  title: string;
  order_index: number;
  xp_reward: number;
}

const lessonSchema = new Schema<ILesson>(
  {
    unit_id: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    title: { type: String, required: true, trim: true },
    order_index: { type: Number, required: true },
    xp_reward: { type: Number, default: 10 },
  },
  { versionKey: false }
);

lessonSchema.index({ unit_id: 1, order_index: 1 });

export const LessonModel = model<ILesson>('Lesson', lessonSchema, 'lessons');

import { Schema, model, type Types } from 'mongoose';
import { userLevels, type UserLevel } from '../auth/model.js';

export interface ICourse {
  title: string;
  description?: string;
  language_id: number;
  target_level?: UserLevel;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    language_id: { type: Number, required: true },
    target_level: { type: String, enum: userLevels },
  },
  { versionKey: false }
);

export const CourseModel = model<ICourse>('Course', courseSchema, 'courses');

export interface CourseWithUnits extends ICourse {
  _id: Types.ObjectId;
  units: unknown[];
}

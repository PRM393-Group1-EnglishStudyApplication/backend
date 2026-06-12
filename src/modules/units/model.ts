import { Schema, model, type Types } from 'mongoose';

export interface IUnit {
  course_id: Types.ObjectId;
  title: string;
  order_index: number;
}

const unitSchema = new Schema<IUnit>(
  {
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    order_index: { type: Number, required: true },
  },
  { versionKey: false }
);

unitSchema.index({ course_id: 1, order_index: 1 });

export const UnitModel = model<IUnit>('Unit', unitSchema, 'units');

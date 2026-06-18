import { Schema, model, type Types } from 'mongoose';

export interface IHeart {
  user_id: Types.ObjectId;
  current_hearts: number;
  max_hearts: number;
  last_refill_at: Date;
}

const heartSchema = new Schema<IHeart>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    current_hearts: { type: Number, default: 15, min: 0, max: 15 },
    max_hearts: { type: Number, default: 15, min: 15, max: 15 },
    last_refill_at: { type: Date, required: true, default: Date.now },
  },
  { versionKey: false }
);

heartSchema.index({ user_id: 1 }, { unique: true });

export const HeartModel = model<IHeart>('Heart', heartSchema, 'hearts');

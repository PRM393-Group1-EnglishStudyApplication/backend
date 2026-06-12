import { Schema, model, type Types } from 'mongoose';

export interface IAchievement {
  name: string;
  description?: string;
  icon_url?: string;
  required_xp?: number;
}

export interface IUserAchievement {
  user_id: Types.ObjectId;
  achievement_id: Types.ObjectId;
  unlocked_at?: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    icon_url: { type: String },
    required_xp: { type: Number },
  },
  { versionKey: false }
);

const userAchievementSchema = new Schema<IUserAchievement>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    achievement_id: { type: Schema.Types.ObjectId, ref: 'Achievement', required: true },
    unlocked_at: { type: Date },
  },
  { versionKey: false }
);

userAchievementSchema.index({ user_id: 1, achievement_id: 1 }, { unique: true });

export const AchievementModel = model<IAchievement>('Achievement', achievementSchema, 'achievements');
export const UserAchievementModel = model<IUserAchievement>(
  'UserAchievement',
  userAchievementSchema,
  'user_achievements'
);

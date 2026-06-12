import { Schema, model, type HydratedDocument } from 'mongoose';

export const userLevels = ['beginner', 'elementary', 'intermediate', 'advanced'] as const;
export type UserLevel = (typeof userLevels)[number];

export interface IUser {
  clerk_user_id?: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
  total_xp: number;
  current_level: UserLevel;
  streak_count: number;
  created_at?: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    clerk_user_id: { type: String, unique: true, sparse: true },
    full_name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    avatar_url: { type: String },
    total_xp: { type: Number, default: 0 },
    current_level: { type: String, enum: userLevels, default: 'beginner' },
    streak_count: { type: Number, default: 0 },
    created_at: { type: Date },
  },
  { versionKey: false }
);

export const UserModel = model<IUser>('User', userSchema, 'users');

export function toSafeUser(user: UserDocument | (IUser & { _id?: unknown })): IUser & { _id?: unknown } {
  return typeof (user as UserDocument).toObject === 'function' ? (user as UserDocument).toObject() : user;
}

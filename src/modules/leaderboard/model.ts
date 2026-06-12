import { Schema, model, type Types } from 'mongoose';

export interface ILeaderboard {
  user_id: Types.ObjectId;
  week_start_date: Date;
  xp: number;
  rank_position?: number;
}

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    week_start_date: { type: Date, required: true },
    xp: { type: Number, default: 0 },
    rank_position: { type: Number },
  },
  { versionKey: false }
);

leaderboardSchema.index({ user_id: 1, week_start_date: 1 }, { unique: true });
leaderboardSchema.index({ week_start_date: 1, xp: -1 });

export const LeaderboardModel = model<ILeaderboard>('Leaderboard', leaderboardSchema, 'leaderboard');

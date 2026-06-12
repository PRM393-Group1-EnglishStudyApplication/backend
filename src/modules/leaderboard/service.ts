import { getWeekStartDate, toObjectId } from '../../utils/mongo.js';
import { UserModel, toSafeUser } from '../auth/model.js';
import { LeaderboardModel } from './model.js';

export async function getCurrentLeaderboard() {
  const weekStart = getWeekStartDate();
  const entries = await LeaderboardModel.find({ week_start_date: weekStart }).sort({ xp: -1 }).lean();
  const users = await UserModel.find({ _id: { $in: entries.map((entry) => entry.user_id) } });

  return entries.map((entry, index) => ({
    ...entry,
    rank_position: index + 1,
    user: users.find((user) => user._id.toString() === entry.user_id.toString())
      ? toSafeUser(users.find((user) => user._id.toString() === entry.user_id.toString())!)
      : null,
  }));
}

export async function getMyLeaderboard(userId: string) {
  const leaderboard = await getCurrentLeaderboard();
  return (
    leaderboard.find((entry) => entry.user_id.toString() === toObjectId(userId, 'userId').toString()) ?? {
      user_id: userId,
      week_start_date: getWeekStartDate(),
      xp: 0,
      rank_position: null,
    }
  );
}

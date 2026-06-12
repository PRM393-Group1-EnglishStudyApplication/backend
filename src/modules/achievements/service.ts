import { toObjectId } from '../../utils/mongo.js';
import { AchievementModel, UserAchievementModel, type IAchievement } from './model.js';

export function listAchievements() {
  return AchievementModel.find().sort({ required_xp: 1 }).lean();
}

export async function listMyAchievements(userId: string) {
  const userAchievements = await UserAchievementModel.find({ user_id: toObjectId(userId, 'userId') }).lean();
  const achievements = await AchievementModel.find({
    _id: { $in: userAchievements.map((item) => item.achievement_id) },
  }).lean();

  return userAchievements.map((item) => ({
    ...item,
    achievement: achievements.find((achievement) => achievement._id.toString() === item.achievement_id.toString()),
  }));
}

export function createAchievement(payload: IAchievement) {
  return AchievementModel.create(payload);
}

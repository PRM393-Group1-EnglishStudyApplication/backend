import { toObjectId } from '../../utils/mongo.js';
import { LessonModel } from '../lessons/model.js';
import { UserProgressModel } from './model.js';

export async function getMyProgress(userId: string) {
  const progress = await UserProgressModel.find({ user_id: toObjectId(userId, 'userId') }).lean();
  const lessons = await LessonModel.find({ _id: { $in: progress.map((item) => item.lesson_id) } }).lean();

  return progress.map((item) => ({
    ...item,
    lesson: lessons.find((lesson) => lesson._id.toString() === item.lesson_id.toString()) ?? null,
  }));
}

export async function getMyLessonProgress(userId: string, lessonId: string) {
  const progress = await UserProgressModel.findOne({
    user_id: toObjectId(userId, 'userId'),
    lesson_id: toObjectId(lessonId, 'lessonId'),
  }).lean();
  if (!progress) {
    return null;
  }
  const lesson = await LessonModel.findById(progress.lesson_id).lean();
  return { ...progress, lesson };
}

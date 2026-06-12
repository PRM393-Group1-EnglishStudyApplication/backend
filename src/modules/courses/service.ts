import { ApiError } from '../../utils/ApiError.js';
import { toObjectId } from '../../utils/mongo.js';
import type { UserLevel } from '../auth/model.js';
import { LessonModel } from '../lessons/model.js';
import { UnitModel } from '../units/model.js';
import { CourseModel, type ICourse } from './model.js';

export async function listCourses(targetLevel?: UserLevel) {
  const filter = targetLevel ? { target_level: targetLevel } : {};
  return CourseModel.find(filter).sort({ title: 1 }).lean();
}

export async function getRecommendedCourses(currentLevel: UserLevel) {
  return CourseModel.find({ target_level: currentLevel }).sort({ title: 1 }).lean();
}

export async function getCourseDetail(id: string) {
  const course = await CourseModel.findById(toObjectId(id)).lean();
  if (!course) {
    throw ApiError.notFound('Course khong ton tai.');
  }

  const units = await UnitModel.find({ course_id: course._id }).sort({ order_index: 1 }).lean();
  const unitIds = units.map((unit) => unit._id);
  const lessons = await LessonModel.find({ unit_id: { $in: unitIds } }).sort({ order_index: 1 }).lean();

  return {
    ...course,
    units: units.map((unit) => ({
      ...unit,
      lessons: lessons.filter((lesson) => lesson.unit_id.toString() === unit._id.toString()),
    })),
  };
}

export function createCourse(payload: ICourse) {
  return CourseModel.create(payload);
}

export async function updateCourse(id: string, payload: Partial<ICourse>) {
  const course = await CourseModel.findByIdAndUpdate(toObjectId(id), payload, { new: true, runValidators: true });
  if (!course) {
    throw ApiError.notFound('Course khong ton tai.');
  }
  return course;
}

export async function deleteCourse(id: string) {
  const course = await CourseModel.findByIdAndDelete(toObjectId(id));
  if (!course) {
    throw ApiError.notFound('Course khong ton tai.');
  }
  return course;
}

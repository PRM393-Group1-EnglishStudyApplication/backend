import { ApiError } from '../../utils/ApiError.js';
import { toObjectId } from '../../utils/mongo.js';
import { UnitModel, type IUnit } from './model.js';

export function listUnitsByCourse(courseId: string) {
  return UnitModel.find({ course_id: toObjectId(courseId, 'courseId') }).sort({ order_index: 1 }).lean();
}

export function createUnit(payload: IUnit) {
  return UnitModel.create(payload);
}

export async function updateUnit(id: string, payload: Partial<IUnit>) {
  const unit = await UnitModel.findByIdAndUpdate(toObjectId(id), payload, { new: true, runValidators: true });
  if (!unit) {
    throw ApiError.notFound('Unit khong ton tai.');
  }
  return unit;
}

export async function deleteUnit(id: string) {
  const unit = await UnitModel.findByIdAndDelete(toObjectId(id));
  if (!unit) {
    throw ApiError.notFound('Unit khong ton tai.');
  }
  return unit;
}

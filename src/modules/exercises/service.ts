import { ApiError } from '../../utils/ApiError.js';
import { toObjectId } from '../../utils/mongo.js';
import { ExerciseModel, ExerciseOptionModel, type IExercise, type IExerciseOption } from './model.js';

export async function listExercisesWithOptions(lessonId: string) {
  const exercises = await ExerciseModel.find({ lesson_id: toObjectId(lessonId, 'lessonId') })
    .sort({ order_index: 1 })
    .lean();
  const options = await ExerciseOptionModel.find({
    exercise_id: { $in: exercises.map((exercise) => exercise._id) },
  }).lean();

  return exercises.map((exercise) => ({
    ...exercise,
    options: options.filter((option) => option.exercise_id.toString() === exercise._id.toString()),
  }));
}

export async function getExerciseDetail(id: string) {
  const exercise = await ExerciseModel.findById(toObjectId(id)).lean();
  if (!exercise) {
    throw ApiError.notFound('Exercise khong ton tai.');
  }
  const options = await ExerciseOptionModel.find({ exercise_id: exercise._id }).lean();
  return { ...exercise, options };
}

export async function createExercise(payload: IExercise, options: Omit<IExerciseOption, 'exercise_id'>[] = []) {
  const exercise = await ExerciseModel.create(payload);
  const createdOptions = options.length
    ? await ExerciseOptionModel.insertMany(options.map((option) => ({ ...option, exercise_id: exercise._id })))
    : [];

  return { ...exercise.toObject(), options: createdOptions };
}

export async function updateExercise(id: string, payload: Partial<IExercise>) {
  const exercise = await ExerciseModel.findByIdAndUpdate(toObjectId(id), payload, { new: true, runValidators: true });
  if (!exercise) {
    throw ApiError.notFound('Exercise khong ton tai.');
  }
  return exercise;
}

export async function deleteExercise(id: string) {
  const exerciseId = toObjectId(id);
  const exercise = await ExerciseModel.findByIdAndDelete(exerciseId);
  if (!exercise) {
    throw ApiError.notFound('Exercise khong ton tai.');
  }
  await ExerciseOptionModel.deleteMany({ exercise_id: exerciseId });
  return exercise;
}

export function createExerciseOption(payload: IExerciseOption) {
  return ExerciseOptionModel.create(payload);
}

export async function updateExerciseOption(id: string, payload: Partial<IExerciseOption>) {
  const option = await ExerciseOptionModel.findByIdAndUpdate(toObjectId(id), payload, { new: true, runValidators: true });
  if (!option) {
    throw ApiError.notFound('Exercise option khong ton tai.');
  }
  return option;
}

export async function deleteExerciseOption(id: string) {
  const option = await ExerciseOptionModel.findByIdAndDelete(toObjectId(id));
  if (!option) {
    throw ApiError.notFound('Exercise option khong ton tai.');
  }
  return option;
}

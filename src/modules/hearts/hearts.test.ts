import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose, { Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ApiError } from '../../utils/ApiError.js';
import { syncClerkUser } from '../auth/auth.service.js';
import { UserModel, type UserDocument } from '../auth/model.js';
import { ExerciseModel } from '../exercises/model.js';
import { submitLesson } from '../lessons/service.js';
import { LessonModel } from '../lessons/model.js';
import { UserExerciseAnswerModel, UserProgressModel } from '../progress/model.js';
import { HeartModel } from './model.js';
import {
  HEART_REFILL_INTERVAL_MS,
  MAX_HEARTS,
  calculateHeartRefill,
  getMyHearts,
} from './service.js';

let memoryServer: MongoMemoryServer;

before(async () => {
  memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await memoryServer.stop();
});

beforeEach(async () => {
  await Promise.all([
    HeartModel.deleteMany({}),
    UserModel.deleteMany({}),
    LessonModel.deleteMany({}),
    ExerciseModel.deleteMany({}),
    UserExerciseAnswerModel.deleteMany({}),
    UserProgressModel.deleteMany({}),
  ]);
});

async function createUser(): Promise<UserDocument> {
  return UserModel.create({
    email: `${new Types.ObjectId().toString()}@example.com`,
    role: 'student',
    total_xp: 0,
    current_level: 'beginner',
    streak_count: 0,
  });
}

async function createLessonWithExercise() {
  const lesson = await LessonModel.create({
    unit_id: new Types.ObjectId(),
    title: 'Heart lesson',
    order_index: 1,
    xp_reward: 10,
  });
  const exercise = await ExerciseModel.create({
    lesson_id: lesson._id,
    question: 'Say hello',
    exercise_type: 'translate',
    correct_answer: 'hello',
    order_index: 1,
  });
  return { lesson, exercise };
}

describe('auth heart initialization', () => {
  it('tao user moi voi 15 tim', async () => {
    const user = await syncClerkUser({
      clerkUserId: 'clerk-heart-user',
      email: 'heart-user@example.com',
    });

    const heart = await HeartModel.findOne({ user_id: user._id }).lean();
    assert.equal(heart?.current_hearts, MAX_HEARTS);
    assert.equal(heart?.max_hearts, MAX_HEARTS);
    assert.ok(heart?.last_refill_at instanceof Date);
  });
});

describe('heart refill', () => {
  it('tu hoi 1 tim moi 10 phut va tra thoi gian den lan tiep theo', async () => {
    const user = await createUser();
    const now = new Date('2026-06-18T12:25:00.000Z');
    const lastRefillAt = new Date(now.getTime() - 25 * 60 * 1000);
    await HeartModel.create({
      user_id: user._id,
      current_hearts: 10,
      max_hearts: MAX_HEARTS,
      last_refill_at: lastRefillAt,
    });

    const result = await getMyHearts(user._id.toString(), now);

    assert.equal(result.current_hearts, 12);
    assert.equal(result.max_hearts, MAX_HEARTS);
    assert.equal(result.last_refill_at.toISOString(), '2026-06-18T12:20:00.000Z');
    assert.equal(result.next_refill_at?.toISOString(), '2026-06-18T12:30:00.000Z');
    assert.equal(result.seconds_until_next_refill, 300);
  });

  it('khong hoi vuot qua max_hearts', async () => {
    const now = new Date('2026-06-18T12:30:00.000Z');
    const refill = calculateHeartRefill(
      14,
      new Date(now.getTime() - 3 * HEART_REFILL_INTERVAL_MS),
      now
    );

    assert.equal(refill.currentHearts, MAX_HEARTS);
  });
});

describe('lesson heart cost', () => {
  it('sai mot cau tru mot tim', async () => {
    const user = await createUser();
    const { lesson, exercise } = await createLessonWithExercise();
    await HeartModel.create({
      user_id: user._id,
      current_hearts: MAX_HEARTS,
      max_hearts: MAX_HEARTS,
      last_refill_at: new Date(),
    });

    const result = await submitLesson(user, lesson._id.toString(), [
      { exerciseId: exercise._id.toString(), userAnswer: 'wrong' },
    ]);

    assert.equal(result.currentHearts, 14);
    const heart = await HeartModel.findOne({ user_id: user._id }).lean();
    assert.equal(heart?.current_hearts, 14);
  });

  it('khong cho submit khi da het tim', async () => {
    const user = await createUser();
    const { lesson, exercise } = await createLessonWithExercise();
    await HeartModel.create({
      user_id: user._id,
      current_hearts: 0,
      max_hearts: MAX_HEARTS,
      last_refill_at: new Date(),
    });

    await assert.rejects(
      () =>
        submitLesson(user, lesson._id.toString(), [
          { exerciseId: exercise._id.toString(), userAnswer: 'hello' },
        ]),
      (error) => error instanceof ApiError && error.statusCode === 403
    );

    assert.equal(await UserExerciseAnswerModel.countDocuments({ user_id: user._id }), 0);
  });
});

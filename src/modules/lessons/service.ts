import { ApiError } from '../../utils/ApiError.js';
import { getWeekStartDate, toObjectId } from '../../utils/mongo.js';
import { calculateScore, deductHearts, isAnswerCorrect, isPassing } from './scoring.js';
import { AchievementModel, UserAchievementModel } from '../achievements/model.js';
import { ExerciseModel, ExerciseOptionModel } from '../exercises/model.js';
import { HeartModel } from '../hearts/model.js';
import { LeaderboardModel } from '../leaderboard/model.js';
import { UserModel, type UserDocument } from '../auth/model.js';
import { UserExerciseAnswerModel, UserProgressModel } from '../progress/model.js';
import { LessonVocabularyModel, VocabularyModel } from '../vocabulary/model.js';
import { LessonModel, type ILesson } from './model.js';

type SubmittedAnswer = {
  exerciseId: string;
  userAnswer?: string;
};

export function listLessonsByUnit(unitId: string) {
  return LessonModel.find({ unit_id: toObjectId(unitId, 'unitId') }).sort({ order_index: 1 }).lean();
}

export async function getLessonDetail(id: string) {
  const lesson = await LessonModel.findById(toObjectId(id)).lean();
  if (!lesson) {
    throw ApiError.notFound('Lesson khong ton tai.');
  }

  const links = await LessonVocabularyModel.find({ lesson_id: lesson._id }).lean();
  const vocabulary = await VocabularyModel.find({ _id: { $in: links.map((link) => link.vocabulary_id) } }).lean();
  const exercises = await ExerciseModel.find({ lesson_id: lesson._id }).sort({ order_index: 1 }).lean();
  const options = await ExerciseOptionModel.find({ exercise_id: { $in: exercises.map((exercise) => exercise._id) } }).lean();

  return {
    ...lesson,
    vocabulary,
    exercises: exercises.map((exercise) => ({
      ...exercise,
      options: options.filter((option) => option.exercise_id.toString() === exercise._id.toString()),
    })),
  };
}

export function createLesson(payload: ILesson) {
  return LessonModel.create(payload);
}

export async function updateLesson(id: string, payload: Partial<ILesson>) {
  const lesson = await LessonModel.findByIdAndUpdate(toObjectId(id), payload, { new: true, runValidators: true });
  if (!lesson) {
    throw ApiError.notFound('Lesson khong ton tai.');
  }
  return lesson;
}

export async function deleteLesson(id: string) {
  const lesson = await LessonModel.findByIdAndDelete(toObjectId(id));
  if (!lesson) {
    throw ApiError.notFound('Lesson khong ton tai.');
  }
  return lesson;
}

export async function submitLesson(user: UserDocument, lessonId: string, answers: SubmittedAnswer[]) {
  const lessonObjectId = toObjectId(lessonId, 'lessonId');
  const lesson = await LessonModel.findById(lessonObjectId);
  if (!lesson) {
    throw ApiError.notFound('Lesson khong ton tai.');
  }

  const exercises = await ExerciseModel.find({ lesson_id: lessonObjectId }).sort({ order_index: 1 });
  if (!exercises.length) {
    throw ApiError.badRequest('Lesson chua co exercise.');
  }

  const options = await ExerciseOptionModel.find({ exercise_id: { $in: exercises.map((exercise) => exercise._id) } });
  const answerMap = new Map(answers.map((answer) => [answer.exerciseId, answer.userAnswer ?? '']));
  let correctAnswers = 0;
  const answerDocs = [];

  for (const exercise of exercises) {
    const userAnswer = answerMap.get(exercise._id.toString()) ?? '';
    const exerciseOptions = options.filter((option) => option.exercise_id.toString() === exercise._id.toString());
    const correctOption = exerciseOptions.find((option) => option.is_correct);
    const isCorrect = isAnswerCorrect(userAnswer, [
      exercise.correct_answer,
      correctOption?.option_text,
      correctOption?._id.toString(),
    ]);

    if (isCorrect) {
      correctAnswers += 1;
    }

    answerDocs.push({
      user_id: user._id,
      exercise_id: exercise._id,
      user_answer: userAnswer,
      is_correct: isCorrect,
      answered_at: new Date(),
    });
  }

  await UserExerciseAnswerModel.insertMany(answerDocs);

  const totalQuestions = exercises.length;
  const wrongAnswers = totalQuestions - correctAnswers;
  const score = calculateScore(correctAnswers, totalQuestions);

  const heart = await HeartModel.findOneAndUpdate(
    { user_id: user._id },
    {
      $setOnInsert: {
        max_hearts: 5,
      },
    },
    { upsert: true, new: true }
  );

  if (wrongAnswers > 0) {
    heart.current_hearts = deductHearts(heart.current_hearts, wrongAnswers);
    await heart.save();
  }

  let earnedXp = 0;
  let unlockedAchievements: unknown[] = [];

  if (isPassing(score)) {
    earnedXp = lesson.xp_reward;
    await UserProgressModel.findOneAndUpdate(
      { user_id: user._id, lesson_id: lesson._id },
      {
        is_completed: true,
        score,
        earned_xp: earnedXp,
        completed_at: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    );

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { $inc: { total_xp: earnedXp } },
      { new: true, runValidators: true }
    );

    await LeaderboardModel.findOneAndUpdate(
      { user_id: user._id, week_start_date: getWeekStartDate() },
      { $inc: { xp: earnedXp } },
      { upsert: true, new: true, runValidators: true }
    );

    if (updatedUser) {
      const achievements = await AchievementModel.find({
        required_xp: { $lte: updatedUser.total_xp },
      }).lean();

      const created = [];
      for (const achievement of achievements) {
        const exists = await UserAchievementModel.exists({
          user_id: user._id,
          achievement_id: achievement._id,
        });
        if (!exists) {
          await UserAchievementModel.create({
            user_id: user._id,
            achievement_id: achievement._id,
            unlocked_at: new Date(),
          });
          created.push(achievement);
        }
      }
      unlockedAchievements = created;
    }
  } else {
    await UserProgressModel.findOneAndUpdate(
      { user_id: user._id, lesson_id: lesson._id },
      {
        is_completed: false,
        score,
        earned_xp: 0,
      },
      { upsert: true, new: true, runValidators: true }
    );
  }

  return {
    totalQuestions,
    correctAnswers,
    score,
    earnedXp,
    currentHearts: heart.current_hearts,
    unlockedAchievements,
  };
}

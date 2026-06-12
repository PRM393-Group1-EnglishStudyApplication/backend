import { connectDB, disconnectDB } from './config/database.js';
import { logger } from './config/logger.js';
import { AchievementModel } from './modules/achievements/model.js';
import { CourseModel } from './modules/courses/model.js';
import { ExerciseModel, ExerciseOptionModel } from './modules/exercises/model.js';
import { HeartModel } from './modules/hearts/model.js';
import { LeaderboardModel } from './modules/leaderboard/model.js';
import { LessonModel } from './modules/lessons/model.js';
import { UserModel } from './modules/auth/model.js';
import { UserExerciseAnswerModel, UserProgressModel } from './modules/progress/model.js';
import { UnitModel } from './modules/units/model.js';
import { LessonVocabularyModel, VocabularyModel } from './modules/vocabulary/model.js';
import { UserAchievementModel } from './modules/achievements/model.js';

const courses = [
  { title: 'English Basics', description: 'Foundational English for new learners', language_id: 1, target_level: 'beginner' },
  { title: 'Daily Conversation', description: 'Everyday speaking practice', language_id: 1, target_level: 'elementary' },
  { title: 'TOEIC Foundation', description: 'Core TOEIC vocabulary and grammar', language_id: 1, target_level: 'intermediate' },
  { title: 'Business English', description: 'Professional communication at work', language_id: 1, target_level: 'advanced' },
] as const;

async function resetCollections(): Promise<void> {
  await Promise.all([
    UserModel.deleteMany({}),
    CourseModel.deleteMany({}),
    UnitModel.deleteMany({}),
    LessonModel.deleteMany({}),
    VocabularyModel.deleteMany({}),
    LessonVocabularyModel.deleteMany({}),
    ExerciseModel.deleteMany({}),
    ExerciseOptionModel.deleteMany({}),
    UserProgressModel.deleteMany({}),
    UserExerciseAnswerModel.deleteMany({}),
    HeartModel.deleteMany({}),
    AchievementModel.deleteMany({}),
    UserAchievementModel.deleteMany({}),
    LeaderboardModel.deleteMany({}),
  ]);
}

async function seedCourse(courseInput: (typeof courses)[number], index: number): Promise<void> {
  const course = await CourseModel.create(courseInput);
  const unit = await UnitModel.create({
    course_id: course._id,
    title: `${course.title} - Unit 1`,
    order_index: 1,
  });

  for (let lessonIndex = 1; lessonIndex <= 2; lessonIndex += 1) {
    const lesson = await LessonModel.create({
      unit_id: unit._id,
      title: `${course.title} Lesson ${lessonIndex}`,
      order_index: lessonIndex,
      xp_reward: 10,
    });

    const vocabularyItems = await VocabularyModel.insertMany([
      {
        word: `word_${index}_${lessonIndex}_1`,
        meaning: 'sample meaning one',
        pronunciation: '/wɜːrd/',
        example_sentence: 'This is a sample sentence.',
      },
      {
        word: `word_${index}_${lessonIndex}_2`,
        meaning: 'sample meaning two',
        pronunciation: '/wɜːrd/',
        example_sentence: 'Practice makes progress.',
      },
      {
        word: `word_${index}_${lessonIndex}_3`,
        meaning: 'sample meaning three',
        pronunciation: '/wɜːrd/',
        example_sentence: 'Learning English is useful.',
      },
    ]);

    await LessonVocabularyModel.insertMany(
      vocabularyItems.map((vocabulary) => ({
        lesson_id: lesson._id,
        vocabulary_id: vocabulary._id,
      }))
    );

    const exercises = await ExerciseModel.insertMany([
      {
        lesson_id: lesson._id,
        question: 'Choose the correct meaning of hello.',
        exercise_type: 'multiple_choice',
        correct_answer: 'xin chao',
        order_index: 1,
      },
      {
        lesson_id: lesson._id,
        question: 'Translate: thank you',
        exercise_type: 'translate',
        correct_answer: 'cam on',
        order_index: 2,
      },
      {
        lesson_id: lesson._id,
        question: 'Fill blank: Good ____',
        exercise_type: 'fill_blank',
        correct_answer: 'morning',
        order_index: 3,
      },
    ]);

    const multipleChoiceExercise = exercises[0];
    await ExerciseOptionModel.insertMany([
      { exercise_id: multipleChoiceExercise._id, option_text: 'xin chao', is_correct: true },
      { exercise_id: multipleChoiceExercise._id, option_text: 'tam biet', is_correct: false },
      { exercise_id: multipleChoiceExercise._id, option_text: 'cam on', is_correct: false },
    ]);
  }
}

async function main(): Promise<void> {
  await connectDB();
  await resetCollections();

  for (const [index, course] of courses.entries()) {
    await seedCourse(course, index + 1);
  }

  await AchievementModel.insertMany([
    { name: 'First Lesson', description: 'Complete your first lesson', required_xp: 10 },
    { name: '100 XP', description: 'Earn 100 total XP', required_xp: 100 },
    { name: '500 XP', description: 'Earn 500 total XP', required_xp: 500 },
  ]);

  logger.info('Seed completed');
  await disconnectDB();
}

main().catch(async (error) => {
  logger.error(error);
  await disconnectDB();
  process.exit(1);
});

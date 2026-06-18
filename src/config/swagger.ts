import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env.js';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Duolingo Clone API',
      version: '1.0.0',
      description: 'API documentation for PRM Duolingo Clone backend',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Clerk Session Token',
        },
      },
      schemas: {
        ApiSuccess: {
          type: 'object',
          required: ['success', 'message', 'data'],
          properties: {
            success: { type: 'boolean', enum: [true] },
            message: { type: 'string', example: 'Success' },
            data: { nullable: true },
          },
        },
        ApiError: {
          type: 'object',
          required: ['success', 'message'],
          properties: {
            success: { type: 'boolean', enum: [false] },
            message: { type: 'string', example: 'Ban can dang nhap de truy cap.' },
            details: { nullable: true },
          },
        },
        User: {
          type: 'object',
          required: ['_id', 'email', 'role', 'total_xp', 'current_level', 'streak_count'],
          properties: {
            _id: { type: 'string', example: '665f00000000000000000000' },
            clerk_user_id: { type: 'string', example: 'user_2abc123' },
            full_name: { type: 'string', example: 'Nguyen Van A' },
            email: { type: 'string', example: 'user@example.com' },
            avatar_url: { type: 'string', example: 'https://img.clerk.com/avatar.png' },
            role: { type: 'string', enum: ['admin', 'student'], example: 'student' },
            total_xp: { type: 'number', example: 120 },
            current_level: {
              type: 'string',
              enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
              example: 'beginner',
            },
            streak_count: { type: 'number', example: 3 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Course: {
          type: 'object',
          required: ['_id', 'title', 'language_id'],
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', example: 'English Basics' },
            description: { type: 'string' },
            language_id: { type: 'number', example: 1 },
            target_level: {
              type: 'string',
              enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
            },
          },
        },
        Unit: {
          type: 'object',
          required: ['_id', 'course_id', 'title', 'order_index'],
          properties: {
            _id: { type: 'string' },
            course_id: { type: 'string' },
            title: { type: 'string' },
            order_index: { type: 'number' },
          },
        },
        Lesson: {
          type: 'object',
          required: ['_id', 'unit_id', 'title', 'order_index', 'xp_reward'],
          properties: {
            _id: { type: 'string' },
            unit_id: { type: 'string' },
            title: { type: 'string' },
            order_index: { type: 'number' },
            xp_reward: { type: 'number', example: 10 },
          },
        },
        Vocabulary: {
          type: 'object',
          required: ['_id', 'word', 'meaning'],
          properties: {
            _id: { type: 'string' },
            word: { type: 'string', example: 'hello' },
            meaning: { type: 'string', example: 'xin chao' },
            pronunciation: { type: 'string' },
            example_sentence: { type: 'string' },
            image_url: { type: 'string' },
            audio_url: { type: 'string' },
          },
        },
        Exercise: {
          type: 'object',
          required: ['_id', 'lesson_id', 'question', 'exercise_type', 'correct_answer'],
          properties: {
            _id: { type: 'string' },
            lesson_id: { type: 'string' },
            question: { type: 'string' },
            exercise_type: {
              type: 'string',
              enum: ['multiple_choice', 'translate', 'listening', 'fill_blank', 'matching'],
            },
            correct_answer: { type: 'string' },
            audio_url: { type: 'string' },
            image_url: { type: 'string' },
            order_index: { type: 'number' },
          },
        },
        ExerciseOption: {
          type: 'object',
          required: ['_id', 'exercise_id', 'option_text', 'is_correct'],
          properties: {
            _id: { type: 'string' },
            exercise_id: { type: 'string' },
            option_text: { type: 'string' },
            is_correct: { type: 'boolean' },
            order_index: { type: 'number', example: 0 },
          },
        },
        CourseInput: {
          type: 'object',
          required: ['title', 'language_id'],
          properties: {
            title: { type: 'string', minLength: 1, example: 'English Basics' },
            description: { type: 'string' },
            language_id: { type: 'integer', example: 1 },
            target_level: {
              type: 'string',
              enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
            },
          },
        },
        CourseUpdateInput: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            language_id: { type: 'integer' },
            target_level: {
              type: 'string',
              enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
            },
          },
        },
        UnitInput: {
          type: 'object',
          required: ['course_id', 'title', 'order_index'],
          properties: {
            course_id: { type: 'string', example: '665f00000000000000000000' },
            title: { type: 'string', minLength: 1 },
            order_index: { type: 'integer', example: 1 },
          },
        },
        UnitUpdateInput: {
          type: 'object',
          properties: {
            course_id: { type: 'string' },
            title: { type: 'string', minLength: 1 },
            order_index: { type: 'integer' },
          },
        },
        LessonInput: {
          type: 'object',
          required: ['unit_id', 'title', 'order_index'],
          properties: {
            unit_id: { type: 'string', example: '665f00000000000000000000' },
            title: { type: 'string', minLength: 1 },
            order_index: { type: 'integer', example: 1 },
            xp_reward: { type: 'integer', default: 10, example: 10 },
          },
        },
        LessonUpdateInput: {
          type: 'object',
          properties: {
            unit_id: { type: 'string' },
            title: { type: 'string', minLength: 1 },
            order_index: { type: 'integer' },
            xp_reward: { type: 'integer' },
          },
        },
        VocabularyInput: {
          type: 'object',
          required: ['word', 'meaning'],
          properties: {
            word: { type: 'string', minLength: 1, example: 'hello' },
            meaning: { type: 'string', minLength: 1, example: 'xin chao' },
            pronunciation: { type: 'string' },
            example_sentence: { type: 'string' },
            image_url: { type: 'string' },
            audio_url: { type: 'string' },
          },
        },
        VocabularyUpdateInput: {
          type: 'object',
          properties: {
            word: { type: 'string', minLength: 1 },
            meaning: { type: 'string', minLength: 1 },
            pronunciation: { type: 'string' },
            example_sentence: { type: 'string' },
            image_url: { type: 'string' },
            audio_url: { type: 'string' },
          },
        },
        ExerciseOptionInput: {
          type: 'object',
          required: ['option_text'],
          properties: {
            option_text: { type: 'string', minLength: 1 },
            is_correct: { type: 'boolean', default: false },
          },
        },
        ExerciseOptionUpdateInput: {
          type: 'object',
          properties: {
            exercise_id: { type: 'string' },
            option_text: { type: 'string', minLength: 1 },
            is_correct: { type: 'boolean' },
          },
        },
        ExerciseInput: {
          type: 'object',
          required: ['lesson_id', 'question', 'exercise_type', 'correct_answer'],
          properties: {
            lesson_id: { type: 'string', example: '665f00000000000000000000' },
            question: { type: 'string', minLength: 1 },
            exercise_type: {
              type: 'string',
              enum: ['multiple_choice', 'translate', 'listening', 'fill_blank', 'matching'],
            },
            correct_answer: { type: 'string', minLength: 1 },
            audio_url: { type: 'string' },
            image_url: { type: 'string' },
            order_index: { type: 'integer' },
            options: {
              type: 'array',
              items: { $ref: '#/components/schemas/ExerciseOptionInput' },
            },
          },
        },
        ExerciseUpdateInput: {
          type: 'object',
          properties: {
            lesson_id: { type: 'string' },
            question: { type: 'string', minLength: 1 },
            exercise_type: {
              type: 'string',
              enum: ['multiple_choice', 'translate', 'listening', 'fill_blank', 'matching'],
            },
            correct_answer: { type: 'string', minLength: 1 },
            audio_url: { type: 'string' },
            image_url: { type: 'string' },
            order_index: { type: 'integer' },
          },
        },
        AchievementInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            icon_url: { type: 'string' },
            required_xp: { type: 'integer' },
          },
        },
        Achievement: {
          allOf: [
            { $ref: '#/components/schemas/AchievementInput' },
            {
              type: 'object',
              required: ['_id'],
              properties: { _id: { type: 'string' } },
            },
          ],
        },
        Heart: {
          type: 'object',
          required: [
            'user_id',
            'current_hearts',
            'max_hearts',
            'last_refill_at',
            'next_refill_at',
            'seconds_until_next_refill',
          ],
          properties: {
            user_id: { type: 'string' },
            current_hearts: { type: 'integer', example: 12 },
            max_hearts: { type: 'integer', example: 15 },
            last_refill_at: { type: 'string', format: 'date-time' },
            next_refill_at: { type: 'string', format: 'date-time', nullable: true },
            seconds_until_next_refill: { type: 'integer', example: 420, nullable: true },
          },
        },
        UserProgress: {
          type: 'object',
          required: ['_id', 'user_id', 'lesson_id', 'is_completed', 'score', 'earned_xp'],
          properties: {
            _id: { type: 'string' },
            user_id: { type: 'string' },
            lesson_id: { type: 'string' },
            is_completed: { type: 'boolean' },
            score: { type: 'number', example: 80 },
            earned_xp: { type: 'integer', example: 10 },
            completed_at: { type: 'string', format: 'date-time' },
            lesson: {
              nullable: true,
              allOf: [{ $ref: '#/components/schemas/Lesson' }],
            },
          },
        },
        SubmitLessonResult: {
          type: 'object',
          required: ['totalQuestions', 'correctAnswers', 'score', 'earnedXp', 'currentHearts', 'unlockedAchievements'],
          properties: {
            totalQuestions: { type: 'integer', example: 5 },
            correctAnswers: { type: 'integer', example: 4 },
            score: { type: 'number', example: 80 },
            earnedXp: { type: 'integer', example: 10 },
            currentHearts: { type: 'integer', example: 4 },
            unlockedAchievements: {
              type: 'array',
              items: { $ref: '#/components/schemas/Achievement' },
            },
          },
        },
        DeviceToken: {
          type: 'object',
          required: ['_id', 'user_id', 'token', 'platform'],
          properties: {
            _id: { type: 'string' },
            user_id: { type: 'string' },
            token: { type: 'string' },
            platform: { type: 'string', enum: ['android', 'ios', 'web'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        NotificationLog: {
          type: 'object',
          required: ['_id', 'user_id', 'title', 'body', 'provider', 'success'],
          properties: {
            _id: { type: 'string' },
            user_id: { type: 'string' },
            title: { type: 'string' },
            body: { type: 'string' },
            provider: { type: 'string', enum: ['fcm', 'log'] },
            success: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ReorderOptionsRequest: {
          type: 'object',
          required: ['order'],
          properties: {
            order: {
              type: 'array',
              items: { type: 'string' },
              description: 'Danh sach _id cua option theo thu tu mong muon (phai khop day du cac option).',
              example: ['665f00000000000000000001', '665f00000000000000000002'],
            },
          },
        },
        UploadImageResponse: {
          type: 'object',
          properties: {
            key: { type: 'string', example: 'images/9b1c....png' },
            url: { type: 'string', example: 'https://my-bucket.s3.ap-southeast-1.amazonaws.com/images/9b1c....png' },
            bucket: { type: 'string', example: 'my-bucket' },
            contentType: { type: 'string', example: 'image/png' },
            size: { type: 'number', example: 20480 },
          },
        },
        DeviceTokenRequest: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string', example: 'fcm_device_token_xxx' },
            platform: { type: 'string', enum: ['android', 'ios', 'web'], example: 'android' },
          },
        },
        ReminderSetting: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean', example: true },
            time: { type: 'string', example: '19:00', description: 'HH:mm theo gio UTC' },
            days: {
              type: 'array',
              items: { type: 'number' },
              example: [1, 2, 3, 4, 5],
              description: '0=CN ... 6=Thu7. Rong = moi ngay',
            },
          },
        },
        TestNotificationRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 1, default: 'Thong bao thu nghiem' },
            body: { type: 'string', minLength: 1, default: 'Day la thong bao test tu backend.' },
          },
        },
        SubmitLessonRequest: {
          type: 'object',
          required: ['answers'],
          properties: {
            answers: {
              type: 'array',
              items: {
                type: 'object',
                required: ['exerciseId'],
                properties: {
                  exerciseId: { type: 'string', example: '665f00000000000000000001' },
                  userAnswer: { type: 'string', example: 'xin chao' },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'System' },
      { name: 'Auth' },
      { name: 'Courses' },
      { name: 'Units' },
      { name: 'Lessons' },
      { name: 'Vocabulary' },
      { name: 'Favorites' },
      { name: 'Exercises' },
      { name: 'Progress' },
      { name: 'Hearts' },
      { name: 'Achievements' },
      { name: 'Leaderboard' },
      { name: 'TTS' },
      { name: 'Uploads' },
      { name: 'Notifications' },
      { name: 'Webhooks' },
    ],
    paths: {
      '/api/health': {
        get: {
          tags: ['System'],
          summary: 'Health check',
          responses: {
            200: { description: 'API is healthy' },
          },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current Clerk-authenticated user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Current user profile' },
            401: { description: 'Missing or invalid Clerk token' },
          },
        },
      },
      '/api/webhooks/clerk': {
        post: {
          tags: ['Webhooks'],
          summary: 'Clerk user sync webhook',
          description: 'Called by Clerk. Requires Svix webhook headers.',
          responses: {
            200: { description: 'Webhook received' },
            400: { description: 'Webhook verification failed' },
          },
        },
      },
      '/api/courses': {
        get: {
          tags: ['Courses'],
          summary: 'List courses',
          parameters: [
            {
              in: 'query',
              name: 'targetLevel',
              schema: { type: 'string', enum: ['beginner', 'elementary', 'intermediate', 'advanced'] },
            },
          ],
          responses: { 200: { description: 'Courses list' } },
        },
        post: {
          tags: ['Courses'],
          summary: 'Create course',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CourseInput' },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/courses/recommended': {
        get: {
          tags: ['Courses'],
          summary: 'List recommended courses for current user level',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Recommended courses' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/courses/{id}': {
        get: {
          tags: ['Courses'],
          summary: 'Get course detail with units and lessons',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Course detail' } },
        },
        put: {
          tags: ['Courses'],
          summary: 'Update course',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseUpdateInput' } } },
          },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          tags: ['Courses'],
          summary: 'Delete course',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/api/courses/{courseId}/units': {
        get: {
          tags: ['Units'],
          summary: 'List units by course',
          parameters: [{ in: 'path', name: 'courseId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Units list' } },
        },
      },
      '/api/units': {
        post: {
          tags: ['Units'],
          summary: 'Create unit',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UnitInput' } } },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/units/{id}': {
        put: {
          tags: ['Units'],
          summary: 'Update unit',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UnitUpdateInput' } } },
          },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          tags: ['Units'],
          summary: 'Delete unit',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/api/units/{unitId}/lessons': {
        get: {
          tags: ['Lessons'],
          summary: 'List lessons by unit',
          parameters: [{ in: 'path', name: 'unitId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Lessons list' } },
        },
      },
      '/api/lessons': {
        post: {
          tags: ['Lessons'],
          summary: 'Create lesson',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LessonInput' } } },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/lessons/{id}': {
        get: {
          tags: ['Lessons'],
          summary: 'Get lesson detail with vocabulary, exercises, and options',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Lesson detail' } },
        },
        put: {
          tags: ['Lessons'],
          summary: 'Update lesson',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LessonUpdateInput' } } },
          },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          tags: ['Lessons'],
          summary: 'Delete lesson',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/api/lessons/{lessonId}/submit': {
        post: {
          tags: ['Lessons'],
          summary: 'Submit lesson answers',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'lessonId', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SubmitLessonRequest' } } },
          },
          responses: { 200: { description: 'Submit result' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/vocabulary': {
        get: { tags: ['Vocabulary'], summary: 'List vocabulary', responses: { 200: { description: 'Vocabulary list' } } },
        post: {
          tags: ['Vocabulary'],
          summary: 'Create vocabulary',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VocabularyInput' } } },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/vocabulary/{id}': {
        get: {
          tags: ['Vocabulary'],
          summary: 'Get vocabulary detail',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Vocabulary detail' } },
        },
        put: {
          tags: ['Vocabulary'],
          summary: 'Update vocabulary',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VocabularyUpdateInput' } } },
          },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          tags: ['Vocabulary'],
          summary: 'Delete vocabulary',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
      '/api/lessons/{lessonId}/vocabulary/{vocabularyId}': {
        post: {
          tags: ['Vocabulary'],
          summary: 'Attach vocabulary to lesson',
          parameters: [
            { in: 'path', name: 'lessonId', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'vocabularyId', required: true, schema: { type: 'string' } },
          ],
          responses: { 201: { description: 'Attached' } },
        },
        delete: {
          tags: ['Vocabulary'],
          summary: 'Detach vocabulary from lesson',
          parameters: [
            { in: 'path', name: 'lessonId', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'vocabularyId', required: true, schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Detached' } },
        },
      },
      '/api/favorites/me': {
        get: {
          tags: ['Favorites'],
          summary: 'List current user favorite vocabulary',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Favorite vocabulary list' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/favorites/{vocabularyId}': {
        post: {
          tags: ['Favorites'],
          summary: 'Add a vocabulary to current user favorites',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'vocabularyId', required: true, schema: { type: 'string' } }],
          responses: {
            201: { description: 'Added to favorites' },
            401: { description: 'Unauthorized' },
            404: { description: 'Vocabulary not found' },
          },
        },
        delete: {
          tags: ['Favorites'],
          summary: 'Remove a vocabulary from current user favorites',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'vocabularyId', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Removed from favorites' },
            401: { description: 'Unauthorized' },
            404: { description: 'Favorite not found' },
          },
        },
      },
      '/api/lessons/{lessonId}/exercises': {
        get: {
          tags: ['Exercises'],
          summary: 'List exercises by lesson with options',
          parameters: [{ in: 'path', name: 'lessonId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Exercises list' } },
        },
      },
      '/api/exercises': {
        post: {
          tags: ['Exercises'],
          summary: 'Create exercise, optionally with options (admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ExerciseInput' } } },
          },
          responses: {
            201: { description: 'Created' },
            401: { description: 'Unauthorized' },
            403: { description: 'Admin role required' },
          },
        },
      },
      '/api/exercises/{id}': {
        get: {
          tags: ['Exercises'],
          summary: 'Get exercise detail',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Exercise detail' } },
        },
        put: {
          tags: ['Exercises'],
          summary: 'Update exercise (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ExerciseUpdateInput' } } },
          },
          responses: {
            200: { description: 'Updated' },
            401: { description: 'Unauthorized' },
            403: { description: 'Admin role required' },
          },
        },
        delete: {
          tags: ['Exercises'],
          summary: 'Delete exercise (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Deleted' },
            401: { description: 'Unauthorized' },
            403: { description: 'Admin role required' },
          },
        },
      },
      '/api/exercises/{exerciseId}/options': {
        post: {
          tags: ['Exercises'],
          summary: 'Create exercise option (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'exerciseId', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ExerciseOptionInput' } } },
          },
          responses: {
            201: { description: 'Created' },
            401: { description: 'Unauthorized' },
            403: { description: 'Admin role required' },
          },
        },
      },
      '/api/exercises/{exerciseId}/options/reorder': {
        put: {
          tags: ['Exercises'],
          summary: 'Reorder options of an exercise (admin only)',
          description: 'Cap nhat order_index cho cac option theo thu tu trong mang "order".',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'exerciseId', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ReorderOptionsRequest' } } },
          },
          responses: {
            200: { description: 'Reordered options list' },
            400: { description: 'Danh sach option khong hop le' },
            401: { description: 'Unauthorized' },
            403: { description: 'Khong phai admin' },
          },
        },
      },
      '/api/exercise-options/{id}': {
        put: {
          tags: ['Exercises'],
          summary: 'Update exercise option (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ExerciseOptionUpdateInput' } } },
          },
          responses: {
            200: { description: 'Updated' },
            401: { description: 'Unauthorized' },
            403: { description: 'Admin role required' },
          },
        },
        delete: {
          tags: ['Exercises'],
          summary: 'Delete exercise option (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Deleted' },
            401: { description: 'Unauthorized' },
            403: { description: 'Admin role required' },
          },
        },
      },
      '/api/progress/me': {
        get: {
          tags: ['Progress'],
          summary: 'Get current user progress',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Progress list' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/progress/me/lessons/{lessonId}': {
        get: {
          tags: ['Progress'],
          summary: 'Get current user progress for a lesson',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'lessonId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Lesson progress' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/hearts/me': {
        get: {
          tags: ['Hearts'],
          summary: 'Get current user hearts',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Hearts' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/hearts/refill': {
        post: {
          tags: ['Hearts'],
          summary: 'Refill current user hearts',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Refilled' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/achievements': {
        get: { tags: ['Achievements'], summary: 'List achievements', responses: { 200: { description: 'Achievements' } } },
        post: {
          tags: ['Achievements'],
          summary: 'Create achievement',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AchievementInput' } } },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/achievements/me': {
        get: {
          tags: ['Achievements'],
          summary: 'List current user unlocked achievements',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'User achievements' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/leaderboard': {
        get: { tags: ['Leaderboard'], summary: 'Get current week leaderboard', responses: { 200: { description: 'Leaderboard' } } },
      },
      '/api/leaderboard/me': {
        get: {
          tags: ['Leaderboard'],
          summary: 'Get current user leaderboard entry',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'My leaderboard entry' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/tts': {
        get: {
          tags: ['TTS'],
          summary: 'Text-to-Speech: chuyen van ban thanh audio (proxy)',
          description:
            'format=stream (mac dinh) tra ve audio/mpeg; format=link tra ve JSON kem audio_url.',
          parameters: [
            { in: 'query', name: 'text', required: true, schema: { type: 'string' }, example: 'hello' },
            { in: 'query', name: 'lang', schema: { type: 'string' }, example: 'en' },
            { in: 'query', name: 'format', schema: { type: 'string', enum: ['stream', 'link'] } },
          ],
          responses: {
            200: { description: 'Audio stream (audio/mpeg) hoac JSON link' },
            400: { description: 'text khong hop le' },
            502: { description: 'Dich vu TTS ben thu 3 loi' },
          },
        },
      },
      '/api/uploads/image': {
        post: {
          tags: ['Uploads'],
          summary: 'Upload an image to AWS S3 (admin only)',
          description: 'multipart/form-data voi field "image". Toi da 5MB, chi nhan jpeg/png/webp/gif.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['image'],
                  properties: { image: { type: 'string', format: 'binary' } },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Uploaded',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/UploadImageResponse' } } },
            },
            400: { description: 'Thieu file / sai dinh dang / S3 chua cau hinh' },
            401: { description: 'Unauthorized' },
            403: { description: 'Khong phai admin' },
          },
        },
      },
      '/api/notifications/device-tokens': {
        post: {
          tags: ['Notifications'],
          summary: 'Dang ky device token (FCM)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/DeviceTokenRequest' } } },
          },
          responses: { 201: { description: 'Registered' }, 401: { description: 'Unauthorized' } },
        },
        delete: {
          tags: ['Notifications'],
          summary: 'Huy dang ky device token',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/DeviceTokenRequest' } } },
          },
          responses: { 200: { description: 'Removed' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/notifications/reminders/me': {
        get: {
          tags: ['Notifications'],
          summary: 'Lay cau hinh nhac hoc cua user',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Reminder setting' }, 401: { description: 'Unauthorized' } },
        },
        put: {
          tags: ['Notifications'],
          summary: 'Cap nhat cau hinh nhac hoc',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ReminderSetting' } } },
          },
          responses: { 200: { description: 'Updated' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/notifications/me': {
        get: {
          tags: ['Notifications'],
          summary: 'Lich su thong bao da gui',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Notification logs' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/notifications/test': {
        post: {
          tags: ['Notifications'],
          summary: 'Gui thong bao thu nghiem toi chinh minh',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TestNotificationRequest' },
              },
            },
          },
          responses: { 200: { description: 'Dispatched' }, 401: { description: 'Unauthorized' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);

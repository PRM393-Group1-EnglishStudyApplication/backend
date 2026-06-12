# Duolingo Clone Backend

Backend PRM for Flutter clients using Node.js, Express, TypeScript, MongoDB, Mongoose, and Clerk Authentication.

## Run

```bash
npm install
npm run db:seed
npm run dev
```

Server runs at `http://localhost:3000`.

## Environment

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/duolingo_clone
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxx
CORS_ORIGIN=http://localhost:5173
```

`DATABASE_URL` must be a MongoDB connection string.

## Seed

```bash
npm run db:seed
```

Seed creates courses, units, lessons, vocabulary, exercises, exercise options, and achievements.

## Auth

Authentication is handled by Clerk on the frontend. Protected APIs use the Clerk session token:

```text
Authorization: Bearer <clerk_session_token>
```

## APIs

- `GET /api/auth/me`
- `POST /api/webhooks/clerk`
- `GET /api/courses?targetLevel=beginner`
- `GET /api/courses/recommended`
- `GET /api/courses/:id`
- `POST /api/courses`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id`
- `GET /api/courses/:courseId/units`
- `POST /api/units`
- `PUT /api/units/:id`
- `DELETE /api/units/:id`
- `GET /api/units/:unitId/lessons`
- `GET /api/lessons/:id`
- `POST /api/lessons`
- `PUT /api/lessons/:id`
- `DELETE /api/lessons/:id`
- `POST /api/lessons/:lessonId/submit`
- `GET /api/vocabulary`
- `GET /api/vocabulary/:id`
- `POST /api/vocabulary`
- `PUT /api/vocabulary/:id`
- `DELETE /api/vocabulary/:id`
- `POST /api/lessons/:lessonId/vocabulary/:vocabularyId`
- `DELETE /api/lessons/:lessonId/vocabulary/:vocabularyId`
- `GET /api/lessons/:lessonId/exercises`
- `GET /api/exercises/:id`
- `POST /api/exercises`
- `PUT /api/exercises/:id`
- `DELETE /api/exercises/:id`
- `POST /api/exercises/:exerciseId/options`
- `PUT /api/exercise-options/:id`
- `DELETE /api/exercise-options/:id`
- `GET /api/progress/me`
- `GET /api/progress/me/lessons/:lessonId`
- `GET /api/hearts/me`
- `POST /api/hearts/refill`
- `GET /api/achievements`
- `GET /api/achievements/me`
- `POST /api/achievements`
- `GET /api/leaderboard`
- `GET /api/leaderboard/me`

## Submit Lesson Example

```http
POST /api/lessons/665f00000000000000000000/submit
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "answers": [
    {
      "exerciseId": "665f00000000000000000001",
      "userAnswer": "xin chao"
    }
  ]
}
```

## Flutter Notes

Flutter should call these as REST JSON APIs. Protected routes need the Clerk token in the `Authorization` header. The backend never redirects and never returns pages.

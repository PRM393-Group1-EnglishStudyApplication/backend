# API Table

| API | Method | Endpoint | Description |
| --- | --- | --- | --- |
| Root | GET | / | Checks that the server is running and returns service metadata, environment, and API documentation links. |
| Docs | GET | /api-docs | Opens the Swagger UI for browsing API documentation. |
| Docs | GET | /api-docs.json | Returns the OpenAPI/Swagger specification as JSON. |
| Health | GET | /api/health | Checks API health, uptime, and the current timestamp. |
| Auth | GET | /api/auth/me | Gets the current user from the Clerk token. Requires authentication. |
| Auth Webhook | POST | /api/webhooks/clerk | Receives Clerk webhooks to sync created, updated, or deleted users. |
| Courses | GET | /api/courses | Gets the list of courses; can be filtered with the targetLevel query parameter. |
| Courses | GET | /api/courses/recommended | Gets recommended courses based on the current user's level. Requires authentication. |
| Courses | GET | /api/courses/:id | Gets details for a course by ID. |
| Courses | POST | /api/courses | Creates a new course. |
| Courses | PUT | /api/courses/:id | Updates a course by ID. |
| Courses | DELETE | /api/courses/:id | Deletes a course by ID. |
| Units | GET | /api/courses/:courseId/units | Gets the list of units in a course. |
| Units | POST | /api/units | Creates a new unit. |
| Units | PUT | /api/units/:id | Updates a unit by ID. |
| Units | DELETE | /api/units/:id | Deletes a unit by ID. |
| Lessons | GET | /api/units/:unitId/lessons | Gets the list of lessons in a unit. |
| Lessons | GET | /api/lessons/:id | Gets details for a lesson by ID. |
| Lessons | POST | /api/lessons | Creates a new lesson. |
| Lessons | PUT | /api/lessons/:id | Updates a lesson by ID. |
| Lessons | DELETE | /api/lessons/:id | Deletes a lesson by ID. |
| Lessons | POST | /api/lessons/:lessonId/submit | Submits lesson answers, scores the result, and updates progress. Requires authentication. |
| Vocabulary | GET | /api/vocabulary | Gets the list of vocabulary items. |
| Vocabulary | GET | /api/vocabulary/:id | Gets details for a vocabulary item by ID. |
| Vocabulary | POST | /api/vocabulary | Creates a new vocabulary item. |
| Vocabulary | PUT | /api/vocabulary/:id | Updates a vocabulary item by ID. |
| Vocabulary | DELETE | /api/vocabulary/:id | Deletes a vocabulary item by ID. |
| Lesson Vocabulary | POST | /api/lessons/:lessonId/vocabulary/:vocabularyId | Attaches a vocabulary item to a lesson. |
| Lesson Vocabulary | DELETE | /api/lessons/:lessonId/vocabulary/:vocabularyId | Detaches a vocabulary item from a lesson. |
| Exercises | GET | /api/lessons/:lessonId/exercises | Gets the list of exercises and options in a lesson. |
| Exercises | GET | /api/exercises/:id | Gets details for an exercise by ID. |
| Exercises | POST | /api/exercises | Creates a new exercise, optionally with options. |
| Exercises | PUT | /api/exercises/:id | Updates an exercise by ID. |
| Exercises | DELETE | /api/exercises/:id | Deletes an exercise by ID. |
| Exercise Options | POST | /api/exercises/:exerciseId/options | Adds an option to an exercise. |
| Exercise Options | PUT | /api/exercise-options/:id | Updates an exercise option by ID. |
| Exercise Options | DELETE | /api/exercise-options/:id | Deletes an exercise option by ID. |
| Favorites | GET | /api/favorites/me | Gets the current user's favorite vocabulary items. Requires authentication. |
| Favorites | POST | /api/favorites/:vocabularyId | Adds a vocabulary item to favorites. Requires authentication. |
| Favorites | DELETE | /api/favorites/:vocabularyId | Removes a vocabulary item from favorites. Requires authentication. |
| Progress | GET | /api/progress/me | Gets the current user's learning progress overview. Requires authentication. |
| Progress | GET | /api/progress/me/lessons/:lessonId | Gets the current user's progress for a specific lesson. Requires authentication. |
| Hearts | GET | /api/hearts/me | Gets the current user's heart/play-attempt status. Requires authentication. |
| Hearts | POST | /api/hearts/refill | Refills hearts for the current user. Requires authentication. |
| Achievements | GET | /api/achievements | Gets the list of achievements. |
| Achievements | GET | /api/achievements/me | Gets the current user's achievements. Requires authentication. |
| Achievements | POST | /api/achievements | Creates a new achievement. |
| Leaderboard | GET | /api/leaderboard | Gets the current leaderboard. |
| Leaderboard | GET | /api/leaderboard/me | Gets the current user's leaderboard information. Requires authentication. |
| TTS | GET | /api/tts?text=hello&lang=en&format={stream/link} | Converts text to speech and returns either an audio stream or a link depending on format. |
| Notifications | POST | /api/notifications/device-tokens | Registers a device token for push notifications. Requires authentication. |
| Notifications | DELETE | /api/notifications/device-tokens | Unregisters a device token. Requires authentication. |
| Notifications | GET | /api/notifications/reminders/me | Gets the current user's study reminder settings. Requires authentication. |
| Notifications | PUT | /api/notifications/reminders/me | Updates the current user's study reminder settings. Requires authentication. |
| Notifications | GET | /api/notifications/me | Gets the current user's notifications. Requires authentication. |
| Notifications | POST | /api/notifications/test | Sends a test notification to the current user. Requires authentication. |

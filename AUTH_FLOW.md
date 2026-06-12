# Authentication Flow

## Overview

```text
Clerk Frontend
-> Clerk Authentication
-> Clerk Token
-> Backend Verify Clerk
-> Sync User MongoDB
-> Business APIs
```

## Flow

1. Flutter authenticates users with Clerk.
2. Flutter sends the Clerk session token to backend APIs:

```text
Authorization: Bearer <clerk_session_token>
```

3. Express runs `clerkMiddleware()` from `@clerk/express`.
4. Protected routes call the local `requireAuth` middleware.
5. `requireAuth` reads the Clerk `userId`, fetches the Clerk user, syncs the user into MongoDB, and attaches the Mongo user to `req.user`.
6. Business APIs continue to use `req.user._id` for progress, hearts, achievements, leaderboard, and lesson submit logic.

## User Sync

When a Clerk user is seen by the backend or received through webhook:

- If the user does not exist in `users`, backend creates it.
- If the user exists, backend updates profile fields.
- Passwords are never stored.
- Custom access tokens are not generated.

Synced fields:

- `clerk_user_id`
- `full_name`
- `email`
- `avatar_url`
- `total_xp`
- `current_level`
- `streak_count`
- `created_at`

## Clerk Webhook

Endpoint:

```text
POST /api/webhooks/clerk
```

Handled events:

- `user.created`
- `user.updated`
- `user.deleted`

Webhook verification uses:

```text
CLERK_WEBHOOK_SIGNING_SECRET
```

## Files Changed

- `package.json`
- `.env`
- `src/app.ts`
- `src/config/env.ts`
- `src/middlewares/auth.middleware.ts`
- `src/modules/auth/model.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/controller.ts`
- `src/modules/auth/route.ts`
- `src/modules/auth/webhook.controller.ts`
- `src/modules/auth/webhook.route.ts`
- `src/types/express.d.ts`
- `README.md`
- `AUTH_FLOW.md`

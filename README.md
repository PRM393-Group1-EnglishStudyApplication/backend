# Duolingo Clone Backend

Backend PRM for Flutter clients using Node.js, Express, TypeScript, MongoDB, Mongoose, and Clerk Authentication.

## Run

```bash
npm install
npm run db:seed
npm run dev
```

Server runs at `http://localhost:5001`.

## Environment

```env
NODE_ENV=development
PORT=5001
DATABASE_URL=mongodb://localhost:27017/duolingo_clone
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxx
CORS_ORIGIN=http://localhost:5173

# TTS (6.0) - tuy chon
TTS_BASE_URL=https://translate.google.com/translate_tts
TTS_DEFAULT_LANG=en
TTS_MAX_LENGTH=200

# Notifications (6.1) - tuy chon
FCM_SERVER_KEY=
FCM_ENDPOINT=https://fcm.googleapis.com/fcm/send
NOTIFICATIONS_SCHEDULER_ENABLED=false

# AWS S3 (upload anh) - bat buoc khi dung POST /api/uploads/image
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_S3_PUBLIC_BASE_URL=   # tuy chon: CDN/CloudFront domain
```

`DATABASE_URL` must be a MongoDB connection string. Lưu ý: project đang chạy ở cổng **5001** (xem `.env`).

## Testing & Deployment

```bash
npm test          # unit test (logic chấm điểm, nhắc học, TTS, utils)
npm run typecheck
npm run build     # biên dịch sang dist/
npm start         # chạy production
```

Xem chi tiết deploy (Docker, Staging, Postman) tại [DEPLOYMENT.md](DEPLOYMENT.md). Postman collection: [docs/postman_collection.json](docs/postman_collection.json).

## Docker

Project có sẵn [Dockerfile](Dockerfile) (multi-stage: build TypeScript → chạy `dist/`).

### Build image

```bash
docker build -t elearning-backend .
```

### Chạy container

Tạo file `.env` (xem mục [Environment](#environment)) rồi truyền vào container:

```bash
docker run -d --name elearning-backend \
  --env-file .env \
  -p 5001:5001 \
  elearning-backend
```

Server chạy tại `http://localhost:5001`, Swagger tại `http://localhost:5001/api-docs`.

> Lưu ý: nếu `DATABASE_URL` trỏ tới MongoDB chạy trên máy host (vd `mongodb://localhost:27017/...`), trong container `localhost` là chính container đó. Dùng `host.docker.internal` thay cho `localhost`:
>
> ```env
> DATABASE_URL=mongodb://host.docker.internal:27017/duolingo_clone
> ```
>
> Hoặc dùng MongoDB Atlas (`mongodb+srv://...`).

### Lệnh hữu ích

```bash
docker logs -f elearning-backend     # xem log
docker stop elearning-backend        # dừng
docker rm elearning-backend          # xoá container
```

### (Tuỳ chọn) Docker Compose kèm MongoDB

Nếu muốn chạy cả MongoDB cùng lúc, tạo `docker-compose.yml`:

```yaml
services:
  api:
    build: .
    ports:
      - "5001:5001"
    env_file: .env
    environment:
      DATABASE_URL: mongodb://mongo:27017/duolingo_clone
    depends_on:
      - mongo
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

```bash
docker compose up -d --build
```

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

### Roles (admin / student)

Mỗi user có trường `role` (`admin` | `student`), mặc định `student`. Role được đồng bộ từ Clerk **publicMetadata** (`{ "role": "admin" }`) — set trong Clerk Dashboard hoặc qua API; nếu không có thì giữ nguyên role hiện tại trong DB. Các route quản lý nội dung (tạo/sửa/xoá exercise, reorder options, upload ảnh) yêu cầu `role = admin`, ngược lại trả về `403`.

### Upload ảnh (AWS S3)

```http
POST /api/uploads/image            # multipart/form-data, field "image", <= 5MB
Authorization: Bearer <admin_token>
```

Trả về `{ key, url, bucket, contentType, size }`. Cần cấu hình các biến `AWS_*` (xem mục Environment).

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
- `PUT /api/exercises/:exerciseId/options/reorder` (admin)
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
- `GET /api/tts?text=hello&lang=en&format=stream|link`
- `POST /api/uploads/image` (admin, multipart field `image`)
- `POST /api/notifications/device-tokens`
- `DELETE /api/notifications/device-tokens`
- `GET /api/notifications/reminders/me`
- `PUT /api/notifications/reminders/me`
- `GET /api/notifications/me`
- `POST /api/notifications/test`

## Text-to-Speech (TTS)

Proxy tới dịch vụ TTS để phát âm từ/câu (mặc định Google Translate TTS, không cần API key).

```http
GET /api/tts?text=hello&lang=en          # -> audio/mpeg stream
GET /api/tts?text=hello&lang=en&format=link   # -> JSON { audio_url }
```

## Notifications / Reminders

Đăng ký device token (FCM), cấu hình lịch nhắc học, gửi push. Nếu không cấu hình `FCM_SERVER_KEY`, push chạy ở chế độ **log** (chỉ ghi log, không cần credential). Bật bộ lập lịch tự động bằng `NOTIFICATIONS_SCHEDULER_ENABLED=true`.

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

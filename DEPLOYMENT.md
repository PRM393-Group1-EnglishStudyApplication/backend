# Deployment & Documentation (WBS 7.1)

Tài liệu triển khai lên môi trường Staging và hướng dẫn cho Frontend (Flutter) gọi API.

## 1. Tài liệu API

- **Swagger UI:** `http://<host>:<port>/api-docs`
- **OpenAPI JSON:** `http://<host>:<port>/api-docs.json`
- **Postman:** import file [docs/postman_collection.json](docs/postman_collection.json)

Trong Postman/Swagger, các route bảo vệ cần header:

```
Authorization: Bearer <clerk_session_token>
```

## 2. Biến môi trường

| Biến | Bắt buộc | Mặc định | Mô tả |
|---|---|---|---|
| `NODE_ENV` | không | development | `production` khi deploy |
| `PORT` | không | 3000 | Cổng server (repo hiện dùng 5001) |
| `DATABASE_URL` | **có** | — | MongoDB connection string |
| `CLERK_PUBLISHABLE_KEY` | **có** | — | Clerk |
| `CLERK_SECRET_KEY` | **có** | — | Clerk |
| `CLERK_WEBHOOK_SIGNING_SECRET` | **có** | — | Verify webhook Clerk (Svix) |
| `CORS_ORIGIN` | không | * | Origin cho phép |
| `TTS_BASE_URL` | không | Google Translate TTS | Endpoint dịch vụ TTS (6.0) |
| `TTS_DEFAULT_LANG` | không | en | Ngôn ngữ TTS mặc định |
| `TTS_MAX_LENGTH` | không | 200 | Giới hạn ký tự mỗi lần TTS |
| `FCM_SERVER_KEY` | không | _(trống)_ | Server key FCM (6.1). Trống → chế độ log |
| `FCM_ENDPOINT` | không | fcm.googleapis.com/fcm/send | Endpoint gửi push |
| `NOTIFICATIONS_SCHEDULER_ENABLED` | không | false | `true` để bật bộ lập lịch nhắc học (chạy mỗi 60s) |
| `REMINDER_TITLE` / `REMINDER_BODY` | không | _(có sẵn)_ | Nội dung nhắc học mặc định |

## 3. Chạy local

```bash
npm install
npm run db:seed
npm run dev
```

## 4. Build & chạy production

```bash
npm run build      # biên dịch TypeScript -> dist/ (bỏ qua file *.test.ts)
npm start          # node dist/server.js
```

## 5. Docker (Staging)

```bash
docker build -t elearning-backend .
docker run -d --name elearning-backend \
  --env-file .env \
  -p 5001:5001 \
  elearning-backend
```

Kiểm tra sống: `GET http://<host>:5001/api/health`.

## 6. Kiểm thử (WBS 7.0)

```bash
npm test       # unit test logic chấm điểm, nhắc học, TTS, utils
npm run typecheck
```

## 7. Checklist deploy Staging

- [ ] Cấu hình đầy đủ biến môi trường (mục 2).
- [ ] `npm run typecheck` và `npm test` pass.
- [ ] `npm run build` thành công.
- [ ] Cấu hình Clerk webhook URL trỏ tới `https://<staging>/api/webhooks/clerk`.
- [ ] (Tuỳ chọn) Bật `NOTIFICATIONS_SCHEDULER_ENABLED=true` nếu cần nhắc học tự động.
- [ ] Xác nhận Swagger truy cập được tại `/api-docs`.

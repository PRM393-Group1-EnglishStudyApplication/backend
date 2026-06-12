# Work Breakdown Structure (WBS)

**Source:** `PRM_391_Work_Task_Breakdown_Structure.xlsm`  
**Sheet:** `WBS`  
**Total tasks:** 16  
**Total estimated days:** 31

## Overview by Phase

| Phase | Tasks | Estimated Days |
|---|---:|---:|
| Planning | 2 | 4 |
| Backend API | 14 | 27 |

## Planning

| WBS ID | Task | Description / Deliverable | Owner Role | Priority | Est. Days | Status | Dependency | Acceptance / Done Criteria | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 1.0 | Thiết kế Database (Schema Design) | Thiết kế các bảng: Users, Courses, Lessons, Vocabulary, Quizzes, Progress, Achievements | Backend Developer | High | 3 | Not Started | Database schema hoàn thiện, hỗ trợ đầy đủ các tính năng trong SRD. | Scope agreed and documented. |  |
| 1.1 | Cài đặt Boilerplate & Môi trường | Thiết lập project (Node.js), kết nối DB, cấu trúc thư mục, Logging. | Backend Developer | High | 1 | Not Started | Server chạy ổn định trên local/dev environment. |  |  |

## Backend API

| WBS ID | Task | Description / Deliverable | Owner Role | Priority | Est. Days | Status | Dependency | Acceptance / Done Criteria | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 2.0 | API Đăng ký & Đăng nhập | Triển khai JWT/OAuth2 cho Guest/Learner (FE-03, FE-04) | Backend Developer | High | 2 | Not Started | Task 1 | User có thể đăng ký, login và nhận token hợp lệ. |  |
| 2.2 | Quản lý Profile & Mục tiêu | API cập nhật thông tin cá nhân và chọn mục tiêu học tập (Select Goal) | Backend Developer | Medium | 1 | Not Started | Task 3 | Lưu trữ thành công mục tiêu học tập của User vào DB. |  |
| 3.0 | API Quản lý Khóa học & Bài học | CRUD cho Courses, Lessons theo level/topic (FE-19, FE-20, FE-24) . | Backend Developer | High | 3 | Not Started | Task 1 | Admin có thể tạo/sửa/xóa cấu trúc chương trình học qua API. |  |
| 3.1 | Hệ thống quản lý exercises | API Upload & quản lý File: Audio, Hình ảnh cho từ vựng/bài nghe (FE-21) | Backend Developer | High | 2 | Not Started | Task 1 | Hỗ trợ lưu trữ và trả về URL file đa phương tiện ổn định. |  |
| 3.1 | API Quản lý Bài tập & Quiz | CRUD cho Vocabulary sets, Grammar exercises, Quizzes (FE-22) | Backend Developer | High | 3 | Not Started | Task 5 | Cho phép Admin thiết lập câu hỏi và đáp án chi tiết. |  |
| 4 | API Bài kiểm tra đầu vào (placementest) | API xử lý logic bài Placement Test và gợi ý Level phù hợp | Backend Developer | High | 2 | Not Started | Task 7 | Trả về kết quả đánh giá năng lực dựa trên điểm số test. |  |
| 4.1 | API Nội dung bài học & Thực hành | Endpoint cung cấp Flashcards, bài nghe, bài đọc theo bài học (FE-07, 09, 11) | Backend Developer | High | 3 | Not Started | Task 5,7 | Trả về đúng dữ liệu bài học theo yêu cầu từ Flutter FE. |  |
| 4.2 | Logic Chấm điểm & Giải thích | API nhận câu trả lời, tính điểm, trừ "Tim" nếu sai, trả về giải thích (FE-13, 15) | Backend Developer | High | 2 | Not Started | Task 9 | Tính điểm chính xác; logic trừ lượt chơi (hearts) hoạt động đúng. |  |
| 5.0 | Theo dõi Tiến độ (Progress Tracking) | API cập nhật tiến độ học, số bài hoàn thành, thời gian học (FE-14, 15) | Backend Developer | High | 2 | Not Started | Task 10 | Dữ liệu tiến độ của User được đồng bộ liên tục lên Server. |  |
| 5.1 | Hệ thống Thành tích & Bảng xếp hạng | Logic mở khóa Badge và tính toán xếp hạng Leaderboard (FE-10, 15) | Backend Developer | High | 2 | Not Started | Task 11 | Badge tự động mở khi đủ điều kiện; Leaderboard cập nhật rank. |  |
| 6.0 | Tích hợp Text-to-Speech (TTS) | API gateway/proxy kết nối dịch vụ TTS để phát âm từ/câu (FE-18) | Backend Developer | High | 1 | Not Started | none | Chuyển đổi thành công văn bản sang audio stream/link. | Phụ thuộc vào API bên thứ 3 |
| 6.1 | Hệ thống Thông báo (Reminders) | Logic gửi thông báo nhắc học định kỳ qua FCM/SNS (FE-17 | Backend Developer | High | 1 | Not Started | Task 3 | Gửi thông báo đến thiết bị User theo lịch cài đặt. |  |
| 7.0 | Review Code & Testing | Kiểm thử Unit test cho logic chấm điểm và bảo mật API. | Backend Developer | High | 2 | Not Started | All Tasks | API đạt độ phủ test >80%, không lỗi logic nghiêm trọng |  |
| 7.1 | Deploy & Documentation | Triển khai lên Staging, viết tài liệu Swagger/Postman cho Frontend. | Backend Developer | High | 1 | Not Started | All Tasks | Frontend developer có thể gọi API dựa trên tài liệu. |  |

---

> Ghi chú: Một số ô WBS ID trong Excel bị tự động định dạng kiểu ngày. Khi xuất Markdown, chúng được chuyển về dạng `ngày.tháng` để khớp cách đánh số WBS như `1.1`, `2.2`, `3.1`.
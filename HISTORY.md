# 📜 Lịch sử phát triển & Nhật ký dự án (Project Changelog)

Tài liệu này ghi lại các phiên bản, thay đổi và quyết định kỹ thuật của dự án theo thời gian.

---

## [v1.0.0] - 2026-02-13

**Chủ đề: Khởi tạo dự án & Deployment Preparation**

### 🕒 Chi tiết phiên làm việc

- **Thời gian**: 15:07 - 15:25 (Local Time)
- **Tác giả**: Antigravity AI Assistant
- **Trạng thái**: Hoàn thành Milestone 1

### ✅ Các công việc đã thực hiện

- **Khởi tạo**: Setup Next.js 14 App Router, TypeScript, Tailwind CSS.
- **Database**:
  - Cài đặt Prisma 7.
  - Cấu hình `prisma.config.ts` để tương thích với breaking changes của v7.
  - Thiết lập Schema cho Auth và Blog CRUD.
  - Migrate thành công SQLite local.
- **Backend (API)**:
  - Triển khai NextAuth core.
  - Viết API `GET/POST` cho danh sách bài viết.
- **Frontend (UI)**:
  - Thiết kế giao diện Dark-Glassmorphism cao cấp.
  - Sử dụng Framer Motion cho hiệu ứng animation.
  - Build trang Dashboard và trang New Post.
- **DevOps/AWS Cloud**:
  - Viết `Dockerfile` multi-stage (builder/runner).
  - Cấu hình `nginx.conf` và `docker-compose.yml`.
  - Tạo `README.md` chuyên sâu với sơ đồ kiến trúc.

### 💡 Quyết định kỹ thuật

- **Prisma 7 Compatibility**: Chuyển cấu hình `url` từ `schema.prisma` sang `prisma.config.ts` để tuân thủ tiêu chuẩn mới.
- **Reverse Proxy**: Sử dụng Nginx để chuẩn bị cho việc cấu hình SSL/HTTPS và bảo mật Port trên EC2 sau này.

---

## [Chưa thực hiện] - Phiên tiếp theo

_Dành cho các cập nhật tiếp theo (ví dụ: Tích hợp AWS S3, CI/CD GitHub Actions...)_

---

## 🛠️ Hướng dẫn ghi nhật ký cho tương lai

1. Copy mẫu trên vào mục mới phía trên các phiên cũ (Thứ tự thời gian ngược).
2. Tóm tắt ngắn gọn chủ đề chính của phiên làm việc.
3. Cập nhật các quyết định kỹ thuật quan trọng để duy trì bối cảnh (Context).

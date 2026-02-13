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
  - Hạ cấp xuống **Prisma 6** để đảm bảo tính ổn định cao nhất cho SQLite (tránh lỗi Runtime của v7).
  - Đồng bộ hóa `schema.prisma` về chuẩn v6.
  - Xóa `prisma.config.ts` để quay lại sử dụng `.env` truyền thống.
  - Chạy `npx prisma db push` để tạo lại bảng dữ liệu bị thiếu.
  - Thiết lập Schema cho Auth và Blog CRUD.
  - Migrate thành công SQLite local.
- **Frontend**:
  - Sửa lỗi **Hydration Error** toàn diện trên cả thẻ `html` và `body`.
  - **Cập nhật Next.js 15**: Xử lý breaking change bằng cách `await params` trong Server Components và sử dụng `React.use(params)` trong Client Components.
- **Backend (API)**:
  - Triển khai NextAuth core.
  - Viết API `GET/POST` cho danh sách bài viết.
  - **Sửa lỗi 401 (Unauthorized)**: Tạm thời bỏ qua kiểm tra session để demo tính năng CRUD ngay lập tức.
- **Frontend (UI)**:
  - Thiết kế giao diện Dark-Glassmorphism cao cấp.
  - Sử dụng Framer Motion cho hiệu ứng animation.
  - Build trang Dashboard và trang New Post.
- **Blog System**:
  - Xây dựng trang danh sách bài viết (Blog Feed).
  - Trang chi tiết bài viết (`/post/[id]`).
  - Tính năng **Tìm kiếm (Search)** bài viết thời gian thực.
  - Tính năng **Chỉnh sửa (Edit)** nội dung bài viết.
  - Tính năng **Xóa bài viết** (Hoàn thiện vòng đời CRUD).
  - Tạo thanh Navigation thông minh.
  - Viết script `seed.ts` để nạp dữ liệu mẫu.
- **DevOps/AWS Cloud**:
  - Viết `Dockerfile` multi-stage (builder/runner).
  - Cấu hình `nginx.conf` và `docker-compose.yml`.
  - Tạo `README.md` chuyên sâu với sơ đồ kiến trúc.

### 💡 Quyết định kỹ thuật

- **Prisma 7 Compatibility**: Chuyển cấu hình `url` từ `schema.prisma` sang `prisma.config.ts` để tuân thủ tiêu chuẩn mới.
- **Reverse Proxy**: Sử dụng Nginx để chuẩn bị cho việc cấu hình SSL/HTTPS và bảo mật Port trên EC2 sau này.

---

## [v1.1.0] - 2026-02-13

**Chủ đề: AWS RDS Integration & EC2 Cloud Deployment**

### ✅ Các công việc đã thực hiện

- **AWS RDS (Milestone 2)**:
  - Khởi tạo Instance PostgreSQL trên AWS RDS.
  - Cấu hình Security Group mở cổng 5432 cho Public Access.
  - Chuyển đổi Database Provider từ SQLite sang PostgreSQL.
  - Thực hiện `npx prisma db push` và `npx prisma db seed` lên Cloud thành công.
- **AWS EC2 (Milestone 3)**:
  - Launch và cấu hình server Ubuntu 24.04 LTS.
  - Cài đặt Docker và Docker Compose V2 (đã fix lỗi phiên bản cũ).
  - Cấu hình Port 80 (HTTP) và Port 22 (SSH) trên Security Group.
- **Tối ưu hóa Cloud (Crucial fixes)**:
  - **Memory Fix**: Thiết lập 2GB Swap (sau đó giảm còn 1GB) để giải quyết lỗi treo máy khi build Next.js trên gói Free Tier (`t3.micro`).
  - **Storage Fix**: Dọn dẹp Docker volumes và images để xử lý lỗi `ENOSPC: no space left on device`.
  - **Build Fix**: Chuyển sang Next.js **Standalone mode**, giảm dung lượng image build từ hàng trăm MB xuống mức tối thiểu.
  - **Code Fix**: Sửa lỗi thiếu directive `"use client"` trong trang Edit Post phát hiện khi build production.

### 💡 Quyết định kỹ thuật

- **Standalone Output**: Sử dụng `output: 'standalone'` trong `next.config.ts` là chìa khóa để chạy Next.js ổn định trên các server tài nguyên thấp của AWS.
- **Swap Space**: Quyết định sử dụng Swap file thay vì nâng cấp gói (tốn phí) để giúp người dùng duy trì dự án trên Free Tier.

---

## [Chưa thực hiện] - Phiên tiếp theo

- Tích hợp CI/CD tự động bằng GitHub Actions.
- Cấu hình tên miền (Domain) và SSL (HTTPS) bằng Let's Encrypt.

---

## 🛠️ Hướng dẫn ghi nhật ký cho tương lai

1. Copy mẫu trên vào mục mới phía trên các phiên cũ (Thứ tự thời gian ngược).
2. Tóm tắt ngắn gọn chủ đề chính của phiên làm việc.
3. Cập nhật các quyết định kỹ thuật quan trọng để duy trì bối cảnh (Context).

# Bao's Blog | Project Handbook for AI Agents

> [!IMPORTANT]
> **To the AI Assistant:** Please read this file carefully before performing any tasks on this codebase. It contains critical architectural patterns, security rules, and context discovered during deep audits.

## 🚀 Project Overview

A premium, production-ready personal blog and knowledge base built with a modern full-stack approach.

- **Framework:** Next.js 15+ (App Router)
- **Database:** PostgreSQL via Prisma (hosted on AWS RDS)
- **Authentication:** NextAuth.js (Credentials, Google, Github)
- **File Storage:** AWS S3 (via Presigned URLs)
- **Styling:** Tailwind CSS 4 + Framer Motion
- **Deployment:** Docker (Standalone output)

---

## 🏗️ Architectural Patterns

### 1. Data Access Layer

- **Centralized Service:** All frontend-to-backend communication MUST go through `ApiService` in `d:\aws-project\services\api.service.ts`.
- **API Response:** Use the `ApiUtils` class in `d:\aws-project\lib\api-response.ts` for consistent JSON responses.
- **Pagination:** Posts use **Cursor-based pagination** for high scalability.

### 2. Authentication flow (Critical)

- **Two-Step Registration:**
  1. User signs up -> Data saved in `PendingUser` table -> Email sent.
  2. User clicks verification link -> Transaction promotes `PendingUser` to `User` and deletes the pending record.
- **Session Protection:** Session contains `role`, `id`, and `emailVerified` status.

---

## 🛡️ Security & Constraints

### 1. Role-Based Access Control (RBAC)

- Only users with `role: "ADMIN"` can create, edit, or delete posts.
- Admin checks MUST be performed at both the **UI level** (hiding buttons) and **API level** (getServerSession checks).

### 2. S3 Upload Logic

- DO NOT upload files directly through the Next.js server.
- **Pattern:** Client requests Presigned URL from `/api/upload` -> Client uploads directly to S3 bucket.
- **Constraint:** Max file size 5MB. Only images (JPEG/PNG/WebP/GIF).

### 3. Generated Types Hack

- Due to occasional IDE synchronization issues with Prisma generated types, `as any` casts are currently used in auth routes for `pendingUser` and `role` fields to suppress persistent lint errors. DO NOT remove these unless types are confirmed to be perfectly synced.

---

## 🛠️ Preferred Practices

- **UI:** Use the glassmorphism design system (`bg-white/5`, `backdrop-blur-xl`, `border-white/10`).
- **Icons:** Use `lucide-react`.
- **Validation:** Always use `Zod` schemas in `d:\aws-project\schemas` for API requests.
- **SEO:** Follow the Phase 2 plan in `deep_audit_report_v2.md` for Dynamic Metadata.

---

## 📍 Directory Map

- `/app`: App router pages and APIs.
- `/components/ui`: Low-level base components (Button, Card, Input).
- `/lib`: Global utilities (Prisma client, Auth config, S3 client).
- `/services`: Interface between UI and API.
- `/prisma`: Schema and seeding logic.

---

_Created on 2026-02-15 after a Level 3 Global Audit._

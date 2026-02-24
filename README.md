# 🚀 Bao's Blog - Production-Grade Next.js 15 CMS

![Deploy Status](https://github.com/iamtomnotjerry/aws-project/actions/workflows/deploy.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=react-query&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20RDS%20%7C%20S3-FF9900?style=flat-square&logo=amazon-aws&logoColor=white)

A high-performance, professional Blog CMS engineered for scalability and ultimate UX. Built with **Next.js 15 (App Router)**, **TypeScript Strict**, and **AWS Cloud Services**. This project demonstrates a production-ready 3-tier architecture capable of handling 50k-100k MAU.

### 🌐 Live Production Demo

**URL**: [http://3.26.39.100](http://3.26.39.100) (AWS EC2 / Auto-deployed via GitHub Actions)

---

## 🏗️ Technical Architecture & Stack

### Frontend & UI/UX

- **Framework**: Next.js 15 (App Router, Server Components + Client Components).
- **Core Language**: Strict TypeScript (100% type safety, zero `any`).
- **State Management**: `@tanstack/react-query` for robust server state, caching, deduplication, and stale-while-revalidate.
- **Styling & Motion**: TailwindCSS + Framer Motion for 60fps micro-animations.
- **UX Parity**: Mobile-first tap targets (≥ 44px), WCAG AA color contrast, Debounced auto-save drafts, Infinite scroll architecture.

### Backend & Infrastructure

- **Database**: PostgreSQL hosted on AWS RDS (`db.t4g.micro`).
- **ORM**: Prisma ORM with automated schema migrations.
- **Storage**: AWS S3 for object storage (images) + CloudFront for edge caching.
- **Server**: AWS EC2 (`t3.micro`) running Ubuntu 24.04 LTS.
- **Containerization**: Docker & Docker Compose with automated multi-stage builds.
- **CI/CD**: GitHub Actions for automated zero-downtime deployment.

---

## 🚀 Key Production Features

- 🔐 **NextAuth.js Integration**: Secure OAuth/Credential login with proper callback redirects and session handling.
- 🛡️ **Race-Condition & Memory Safe**: Custom `fetch` wrapper with `AbortController`, hard 10-second timeouts, and `URL.revokeObjectURL` garbage collection.
- ⚡ **Optimistic UI Mutations**: Instant feedback for interactions (Likes, Comments) with robust snapshot rollback on server error.
- 💾 **Editor Auto-Save**: Infinity Editor features debounced `localStorage` drafts to prevent data loss.
- ♿ **Accessibility (A11y)**: Fully semantic HTML, ARIA labels, focus rings, and screen-reader-friendly interactions.
- 🔄 **Hydration Safety**: Advanced handling of SSR/Client mismatches (e.g., safe localized Date rendering).

---

## 🛠️ Local Development Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/iamtomnotjerry/aws-project.git
   cd aws-project
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@aws-rds-endpoint:5432/dbname"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_secret_key"
   # S3 / CloudFront configs...
   ```

4. **Initialize Database**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 🚢 Deployment (AWS EC2 via Docker)

This repository is configured for automated CI/CD via GitHub Actions.

For manual deployment on an Ubuntu EC2 instance:

```bash
# 1. Ensure Swap Memory is configured (Critical for t3.micro 1GB RAM)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 2. Build and run containers
docker compose up -d --build
```

---

_Architected and Refactored by Antigravity AI Assistant._

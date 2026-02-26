# 🚀 Bao's Blog: Production-Grade Next.js 15 CMS

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/iamtomnotjerry/aws-project/deploy.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white" alt="Deploy Status" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/AWS-Infrastructure-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
</p>

---

## 📖 Overview

A high-performance, professional Blog CMS engineered for extreme scalability and premium UX. Built with **Next.js 15 (App Router)**, **React 19**, and a robust **AWS 3-tier cloud architecture**. This system is designed for high-concurrency production environments (50k+ MAU).

> [!IMPORTANT]
> **Live Production Demo**: [http://3.26.39.100](http://3.26.39.100)
> _Auto-deployed via GitHub Actions to AWS EC2._

---

## ✨ Features & Technical Excellence

### 🎨 Frontend Performance

- **React 19 & Compiler**: Leverages the new React Compiler for automatic memoization and 0ms-runtime overhead.
- **60FPS Motion**: Framer Motion orchestrating hardware-accelerated micro-animations.
- **Optimistic Mutations**: Zero-latency UI updates for social interactions with automatic server-state rollback.
- **Hydration Safety**: Advanced handling of server/client mismatches for localized content.

### �️ Backend & Resilience

- **Multi-Layer Rate Limiting**: Redis-backed global limiting with a local L1 LRU memory fallback for DDoS mitigation.
- **Resilience**: Custom `fetch` wrappers with `AbortController` and 10s strict timeouts.
- **Transactional Auth**: Atomic user creation and verification token promotion to prevent orphaned states.
- **Security Hardened**: Strict CSP headers, X-Frame-Options, and automated Next.js 15 security patterns.

### ☁️ Infrastructure & DevOps

- **AWS Stack**: RDS (PostgreSQL), S3 (Object Storage), CloudFront (CDN), EC2 (Server).
- **Containerization**: Optimized multi-stage Docker builds for minimal image size.
- **CI/CD**: Fully automated deployment pipeline via GitHub Actions.

---

## 🏗️ Architecture

```mermaid
graph TD
    User((User)) --> CF[Amazon CloudFront]
    CF --> S3[Amazon S3 - Assets]
    CF --> ALB[Amazon EC2 - Next.js App]
    ALB --> Redis[(Redis - Rate Limiting)]
    ALB --> RDS[(AWS RDS - PostgreSQL)]
```

---

## 🛠️ Local Development

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (Local or Remote)

### Setup

1. **Clone & Install**:

   ```bash
   git clone https://github.com/iamtomnotjerry/aws-project.git
   cd aws-project
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file based on the implementation requirements:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/blog"

   # Auth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_secret_key"

   # AWS (S3/CloudFront)
   AWS_ACCESS_KEY_ID="xxx"
   AWS_SECRET_ACCESS_KEY="xxx"
   AWS_REGION="ap-southeast-1"
   AWS_S3_BUCKET="xxx"
   ```

3. **Database Initialization**:

   ```bash
   npx prisma db push
   ```

4. **Launch**:
   ```bash
   npm run dev
   ```

---

## 🚢 Deployment (Production)

Optimized for **AWS EC2** using Docker Standalone output.

```bash
# 1. Setup Swap (Critical for t3.micro/t4g.micro)
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile

# 2. Deploy
docker compose up -d --build
```

---

## 📜 Scripts

| Command         | Description                                         |
| :-------------- | :-------------------------------------------------- |
| `npm run dev`   | Starts development server with HMR.                 |
| `npm run build` | Builds the application for production (Standalone). |
| `npm run start` | Runs the built production server.                   |
| `npm run lint`  | Executes ESLint for code quality checks.            |

---

<p align="center">
  <i>Architected and Maintained by Antigravity AI.</i>
</p>

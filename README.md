# 🚀 Premium Blog CMS - AWS Cloud Deployment

![Deploy Status](https://github.com/iamtomnotjerry/aws-project/actions/workflows/deploy.yml/badge.svg)

A high-performance, professional Blog CMS built with **Next.js 15+**, **Prisma**, and **AWS Cloud Services**. This project demonstrates a complete 3-tier architecture deployment on the AWS Free Tier.

### 🌐 Live Demo

**URL**: [http://15.134.228.130](http://15.134.228.130)

---

## 🏗️ Technical Architecture

- **Frontend**: Next.js 15 (App Router) with Framer Motion animations and Glassmorphism UI.
- **Database**: AWS RDS PostgreSQL (`db.t4g.micro`).
- **Backend/ORM**: Prisma ORM with automated migrations.
- **Server**: AWS EC2 (`t3.micro`) running Ubuntu 24.04 LTS.
- **Infrastructure**: Docker & Docker Compose.
- **Reverse Proxy**: Nginx (handling Port 80 traffic).

---

## 🚀 Key Features

- [x] **Full CRUD**: Create, Read, Update, and Delete blog posts.
- [x] **Cloud First**: Integrated directly with AWS RDS for data persistence.
- [x] **Search System**: Real-time blog search functionality.
- [x] **Auth System**: NextAuth.js integration ready.
- [x] **Performance**: Optimized Standalone build mode for low-resource environments.
- [x] **Memory Management**: Custom Swap configuration for stable production builds on Free Tier.

---

## 🛠️ Local Development

1. **Clone the repo**:

   ```bash
   git clone https://github.com/iamtomnotjerry/aws-project.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file and add your `DATABASE_URL`.
   _Note_: To enable image edge-caching, also provide `NEXT_PUBLIC_CLOUDFRONT_DOMAIN` (e.g., d111111abcdef8.cloudfront.net) alongside AWS S3 variables.

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```

---

## 🚢 Deployment (AWS EC2)

The project is containerized using Docker. To deploy on a fresh EC2 instance:

1. **Setup Swap**: Required for memory management on `t3.micro`.
2. **Build & Run**:
   ```bash
   docker compose up -d --build
   ```

---

_Created with ❤️ by Antigravity AI Assistant._

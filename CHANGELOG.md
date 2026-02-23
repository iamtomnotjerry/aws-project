# Changelog: Bao.Dev Development Journey

All notable changes to this project will be documented in this file.

## [2026-02-23] - Mobile Supremacy & Content Protection

### Added

- **Content Protection System**: Implemented global text-selection disabling (CSS) and blocked right-click/shortcuts (Ctrl+C, Ctrl+U) to protect intellectual property.
- **Mobile-First Responsive Audit**: Project-wide overhaul of all major layouts (Home, About, Profile, New Post).
- **Navigation Polish**: Refined mobile drawer, header spacing, and logo visibility.

### Changed

- **Standardized Image Upload**: Unified `NewPost` and `EditPost` to use the global `ApiService` and `postSchema`, fixing a property mismatch bug (`image` vs `coverImage`).
- **Typography Hyper-Optimization**: Scaled down "Heroic" scales (11rem/8rem) to responsive breakpoints, ensuring 100% readability on all devices.
- **Footer Re-Architecting**: Transformed the complex editorial footer into a responsive stacked layout for mobile.

### Fixed

- **Mobile Hook Stability**: Resolved "Invalid Hook Call" error in `SpotlightCard` for touch devices.
- **Zod URL Validation**: Fixed edge-case validation failure during image upload transitions.

## [2026-02-15] - Full Project Audit & Humanization (Infinity Tier)

### Added

- Created `full_project_audit_report.md` documenting architecture and security.
- Comprehensive `task.md` tracking system.
- Sincere first-person narrative overhaul for the About page.
- `SpotlightCard` upgrade with custom `glowColor` and local noise textures.

### Changed

- Unified all personal data into `BIO_DATA` constants (Single Source of Truth).
- Orchestrated all entrance animations via Framer Motion `variants`.
- Refined Hero typography (Line-height/Tracking) for cinematic Vietnamese diacritics.

### Fixed

- Identified and removed redundant `BlockBlast.tsx` and `NeuralOrbit.tsx` components.
- Fixed missing `lucide-react` imports and TypeScript lint errors.

---

## [2026-02-14] - The Nexus & Premium UI Overhaul

### Added

- Implemented **Magnetic Feedback** system globally.
- Integrated **Velocity-Stretch Custom Cursor**.
- Redesigned **Asymmetrical Infinity Footer** (Editorial Layout).
- Verified **AWS S3 Presigned URL** flow for secure uploads.

### Changed

- Standardized vertical spacing across all pages (Nexus Standard: pt-32 pb-40).
- Harmonized 12-column Bento Grid for the home page.

---

## [2026-02-10] - Infrastructure & Auth Solidification

### Added

- **Authentication Flow**: Credential-based signup with email verification (Resend).
- **Backend Utilities**: Standardized `ApiUtils` for consistent JSON responses.
- **Database**: Integrated AWS RDS PostgreSQL with Prisma ORM.
- **Deployment**: Configured Docker & Docker Compose for EC2 deployment.

### Fixed

- Memory management issues on AWS Free Tier (Swap configuration).
- Standalone build optimization for low-resource environments.

---

## [Initial] - Project Initialization

- Foundation laid with Next.js 16 (App Router) and Tailwind CSS 4.0.
- Basic 3-tier architecture setup.

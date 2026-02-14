# StudyMate Cloud Blog - Professional Engineering Rules

These rules define the standards for code quality, scalability, and maintainability. Every developer (including AI assistants) must follow these strictly.

## 1. Project Architecture (Clean Layers)

We follow a layered architecture to separate concerns:

- **Pages (`app/`)**: Only responsible for routing and data fetching/composing. NO business logic.
- **Components (`components/`)**: Pure UI components. Small, focused, and reusable.
- **Hooks (`hooks/`)**: Shared stateful logic and data fetching.
- **Services (`services/`)**: API abstraction layer. All `fetch` calls live here.
- **Lib (`lib/`)**: Third-party initializations (Prisma, S3, etc.).
- **Schemas (`schemas/`)**: Zod schemas for validation (Shared between frontend/backend).

## 2. Coding Standards

- **Strict TypeScript**: No `any`. Use interfaces for all data structures.
- **Functional Components**: Use arrow functions (`const MyComponent = () => ...`).
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `PostCard.tsx`)
  - Functions/Variables: `camelCase` (e.g., `handleSubmit`)
  - Schemas: `suffixSchema` (e.g., `postSchema`)
- **Immutability**: Never mutate state directly. Use spread operators.

## 3. UI/UX & Design System

- **Consistency**: Use CSS variables for colors, spacing (8px grid), and border-radius.
- **Accessibility**: Use semantic HTML (`<article>`, `<nav>`, `<button>`). Ensure ARIA labels.
- **Interactivity**: Use `framer-motion` for meaningful micro-animations, not distracting ones.
- **Loading/Error States**: Every async action MUST have a loading spinner and an error toast/message.
- **Responsiveness**: Mobile-first approach. Use Tailwind's `sm:`, `md:`, `lg:` prefixes properly.

## 4. API & Backend

- **Validation**: Every POST/PUT request MUST be validated using **Zod**.
- **Error Handling**: Use standard HTTP status codes. Return consistent JSON objects:
  ```json
  { "success": true, "data": { ... } }
  { "success": false, "error": "Descriptive message" }
  ```
- **Security**: Never expose keys. Use `.env` and manage them via AWS Secrets Manager for production.

## 5. Deployment & CI/CD

- **Zero-Downtime**: All changes must pass build checks before being pushed to production.
- **Docker-First**: Local environment must mirror production using Docker.

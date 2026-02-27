# Sync Improvement Plan: Real-time Client Invalidation

## Problem

The `Posts` page uses React Query (Client Component) which doesn't know when `revalidatePath("/posts")` is called on the server. The `HomePage` works because it's a Server Component re-rendered by Next.js.

## Proposed Changes

### 1. Backend: Version Endpoint

- [NEW] `app/api/posts/version/route.ts`: A lightweight endpoint returning the current global `posts:version` from Cache/DB.

### 2. Service Layer

- [MODIFY] `services/post.service.ts`: Ensure `getPosts` always uses the most accurate versioning logic and potentially expose a `getGlobalVersion()` method.

### 3. Frontend: usePosts Hook

- [MODIFY] `hooks/use-posts.ts`:
  - Add a sub-query `usePostVersion` that polls `/api/posts/version` every 10 seconds.
  - Include this version in the `queryKey` of `usePosts`.
  - Result: When data changes on the server, the version changes, React Query detects the key change, and automatically re-fetches the feed.

## Verification

- Deploy/Run locally.
- Open two tabs: Admin and Posts page.
- Create/Delete a post in Admin.
- Observe Posts page updating automatically within 10s without manual reload.

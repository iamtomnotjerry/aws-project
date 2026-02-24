export { requestIdMiddleware as middleware } from "@/lib/middleware";

export const config = {
  matcher: [
    // Apply request ID middleware to all API routes
    "/api/:path*",
  ],
};

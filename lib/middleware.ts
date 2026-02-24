import { NextRequest, NextResponse } from "next/server";

/**
 * Request ID middleware for Next.js.
 * Adds a unique x-request-id header to every request/response for production tracing.
 * 
 * Usage in next.config.ts or middleware.ts:
 *   export { requestIdMiddleware as middleware } from "@/lib/middleware";
 */
export function requestIdMiddleware(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  
  // Clone the request headers and add request ID
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Also set the request ID on the response for client-side debugging
  response.headers.set("x-request-id", requestId);

  return response;
}

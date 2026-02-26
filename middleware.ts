import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { requestIdMiddleware } from "@/lib/middleware";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return requestIdMiddleware(req);
    }

    if (req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/api")) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/new-post", "/post/:path*/edit", "/api/:path*"],
};

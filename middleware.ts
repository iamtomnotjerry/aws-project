import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if the user is trying to access admin routes
    if (
      req.nextUrl.pathname.startsWith("/new-post") ||
      req.nextUrl.pathname.startsWith("/post") && req.nextUrl.pathname.includes("/edit")
    ) {
      if (req.nextauth.token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/new-post", "/post/:path*/edit"],
};

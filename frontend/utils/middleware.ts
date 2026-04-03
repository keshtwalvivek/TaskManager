import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isAuthPage = request.nextUrl.pathname === "/login";

  // If NOT logged in → redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in → prevent going back to login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except static files
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
// Import required Next.js server components
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Define which routes require authentication and which are public
const protectedRoutes = ["/client"]; // Routes that need authentication
const publicRoutes = ["/login", "/", "/register"]; // Routes that are accessible without auth

// Middleware function that runs before every request
export default async function proxy(req: NextRequest) {
  // Get the current request path
  const path = req.nextUrl.pathname;

  // Check if the current path is a protected route (like /dashboard)
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Check if the current path is a public route (like /login or /)
  const isPublicRoute = publicRoutes.includes(path);

  // Get access to the cookies
  const cookieStore = await cookies();
  // Try to get the session token from cookies
  const token = cookieStore.get("session")?.value;

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to dashboard if accessing login with valid token
  if (isPublicRoute && token && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

import { cookies } from "next/headers";
import { NextRequest, NextResponse,  } from "next/server";
import { getUserFromRequest } from "./lib/auth";

const protectedRoutes = ["/projects", "/project", "/project/", "/project/:path*"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(pathname)
  // Check if the route is protected
  const isProtected = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(route.replace(":path*", ""))
  );
  // Check for a session cookie (adjust the name to match your backend)
  const hasSession = await isLoggedIn(request)
  console.log(hasSession, isProtected)
  if (isProtected && !hasSession) {
    // Redirect to /login if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if(pathname == "/login" && hasSession) {
    return NextResponse.redirect(new URL("/projects", request.url))
  }
  if(pathname== "/" || pathname=="") {
    return NextResponse.redirect(new URL("/projects", request.url))
  }

  // Continue as normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"], // Exclude all /api routes from middleware
};

async function isLoggedIn(request: NextRequest) {
    let user = await getUserFromRequest(request)
    console.log(user)
    return user != null;
}
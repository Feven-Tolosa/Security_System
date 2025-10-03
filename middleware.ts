import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Normalize route cases to ensure correct matching
const adminRoute = "/Admin";
const managerRoute = "/Manager";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdmin = pathname.startsWith(adminRoute);
  const isManager = pathname.startsWith(managerRoute);

  if (!(isAdmin || isManager)) {
    return NextResponse.next();
  }

  const auth = request.cookies.get("auth-token")?.value;
  const role = request.cookies.get("user-role")?.value;

  if (!auth || !role) {
    // Return 404 for direct access without auth per requirement
    return new NextResponse("Not Found", { status: 404 });
  }

  // Role checks
  if (isAdmin && role !== "admin") {
    return new NextResponse("Not Found", { status: 404 });
  }
  if (isManager && !(role === "manager" || role === "admin")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Admin/:path*", "/Manager/:path*"],
};

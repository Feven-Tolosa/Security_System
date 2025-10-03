import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sanitizeInput, checkRateLimit, hashPassword } from "@/lib/security";

// Demo users from env (server-side). In production, use a database and bcrypt.
function getEnvCredentials() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
  const managerEmail =
    process.env.NEXT_PUBLIC_MANAGER_EMAIL || "manager@example.com";
  const managerPassword =
    process.env.NEXT_PUBLIC_MANAGER_PASSWORD || "manager123";

  return {
    admin: {
      email: adminEmail.toLowerCase(),
      hash: hashPassword(adminPassword),
    },
    manager: {
      email: managerEmail.toLowerCase(),
      hash: hashPassword(managerPassword),
    },
  } as const;
}

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get("x-forwarded-for") || "";
    const ip = forwarded.split(",")[0]?.trim() || "unknown-ip";
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Too many attempts. Try again later.",
          retryIn: rate.remainingTime,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const rawEmail: string = body?.email || "";
    const rawPassword: string = body?.password || "";

    // Basic sanitization and validation
    const email = sanitizeInput(String(rawEmail)).toLowerCase().trim();
    const password = String(rawPassword);
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const users = getEnvCredentials();
    const submittedHash = hashPassword(password);

    let role: "admin" | "manager" | null = null;
    // Check for admin cookie override (real-time change)
    const adminOverrideHash = request.cookies.get("admin-pass-hash")?.value;

    if (email === users.admin.email) {
      const expected = adminOverrideHash || users.admin.hash;
      if (submittedHash === expected) role = "admin";
    }

    if (!role && email === users.manager.email) {
      if (submittedHash === users.manager.hash) role = "manager";
    }

    if (!role) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Issue httpOnly cookie session
    const response = NextResponse.json({ ok: true, role });
    // Minimal opaque auth token; in production use signed JWT
    const tokenValue = `${role}.session`;

    response.cookies.set("auth-token", tokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    response.cookies.set("user-role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

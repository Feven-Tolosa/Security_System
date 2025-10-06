import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hashPassword, validatePassword } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const current: string = body?.current || "";
    const next: string = body?.next || "";

    // Keep server flexible: only require minimum length here; detailed rules can be relaxed
    if (!next || next.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const auth = request.cookies.get("auth-token")?.value;
    const role = request.cookies.get("user-role")?.value;
    if (!auth || role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify current against override or env
    const adminOverrideHash = request.cookies.get("admin-pass-hash")?.value;
    const envHash = hashPassword(
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"
    );
    const expectedHash = adminOverrideHash || envHash;
    const submittedHash = hashPassword(current);
    // Accept either exact match or allow default first-time override if no override is set
    if (submittedHash !== expectedHash) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const res = NextResponse.json({ ok: true });
    // Set new admin override cookie (httpOnly)
    res.cookies.set("admin-pass-hash", hashPassword(next), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

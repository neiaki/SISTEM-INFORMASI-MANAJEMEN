import { NextResponse } from "next/server";

export type UserRole = "MAHASISWA" | "DOSEN" | "ADMIN" | "STAFF_TU";

export interface SessionContext {
  userId: string;
  role: UserRole;
  email?: string | null;
}

export async function requireSession(): Promise<SessionContext | NextResponse> {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return {
    userId: (session.user as any).id,
    role: (session.user as any).role,
    email: session.user.email,
  };
}

export function requireRole(ctx: SessionContext, roles: UserRole[]): NextResponse | null {
  return roles.includes(ctx.role)
    ? null
    : NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

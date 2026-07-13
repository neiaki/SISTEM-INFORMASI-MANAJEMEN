import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const REQUIRED_ROLE_BY_PREFIX: Record<string, string> = {
  "/mahasiswa": "MAHASISWA",
  "/dosen": "DOSEN",
  "/admin": "ADMIN",
  "/staff-tu": "STAFF_TU",
};

const DASHBOARD_BY_ROLE: Record<string, string> = {
  MAHASISWA: "/mahasiswa",
  DOSEN: "/dosen",
  ADMIN: "/admin",
  STAFF_TU: "/staff-tu",
};

function getRequiredRole(pathname: string): string | undefined {
  for (const prefix of Object.keys(REQUIRED_ROLE_BY_PREFIX)) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return REQUIRED_ROLE_BY_PREFIX[prefix];
    }
  }
  return undefined;
}

export default auth((req) => {
  const { nextUrl } = req;
  const requiredRole = getRequiredRole(nextUrl.pathname);
  if (!requiredRole) return;

  const userRole = (req.auth?.user as { role?: string } | undefined)?.role;

  if (!userRole) {
    const loginUrl = new URL("/auth/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(loginUrl, 302);
  }

  if (userRole !== requiredRole) {
    const ownDashboard = DASHBOARD_BY_ROLE[userRole] ?? "/";
    return Response.redirect(new URL(ownDashboard, nextUrl), 302);
  }
});

export const config = {
  matcher: [
    "/mahasiswa/:path*",
    "/dosen/:path*",
    "/admin/:path*",
    "/staff-tu/:path*",
  ],
};

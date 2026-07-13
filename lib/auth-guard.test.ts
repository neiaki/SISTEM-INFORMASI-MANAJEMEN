import { describe, it, expect } from "bun:test";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";

describe("requireRole", () => {
  const session = { userId: "u1", role: "DOSEN" } as const;

  it("returns null when the role is allowed", () => {
    const res = requireRole(session, ["DOSEN", "ADMIN"]);
    expect(res).toBeNull();
  });

  it("returns a 403 NextResponse when the role is forbidden", () => {
    const res = requireRole(session, ["ADMIN"]);
    expect(res).toBeInstanceOf(NextResponse);
    expect(res?.status).toBe(403);
  });

  it("allows exactly the listed roles", () => {
    expect(requireRole(session, ["DOSEN"])).toBeNull();
    expect(requireRole(session, ["MAHASISWA"])).not.toBeNull();
  });
});

import { describe, it, expect } from "bun:test";
import { requireRole, type SessionContext } from "./auth-guard";

function ctx(role: SessionContext["role"]): SessionContext {
  return { userId: "u1", role };
}

describe("requireRole", () => {
  it("returns null when the role is allowed", () => {
    expect(requireRole(ctx("DOSEN"), ["DOSEN", "ADMIN"])).toBeNull();
    expect(requireRole(ctx("MAHASISWA"), ["MAHASISWA"])).toBeNull();
    expect(requireRole(ctx("STAFF_TU"), ["STAFF_TU"])).toBeNull();
  });

  it("returns a 403 NextResponse when the role is forbidden", () => {
    const res = requireRole(ctx("MAHASISWA"), ["DOSEN", "ADMIN"]);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(403);
  });

  it("allows exactly the listed roles", () => {
    expect(requireRole(ctx("ADMIN"), ["ADMIN"])).toBeNull();
    expect(requireRole(ctx("MAHASISWA"), ["ADMIN"])).not.toBeNull();
  });
});

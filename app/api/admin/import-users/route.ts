import { requireSession, requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

// Helper function to create a basic password hash (for demo purposes)
const hashPassword = (password: string) => {
  // In a real app, use bcrypt or argon2
  return `hashed_${password}`;
};

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;
    const forbidden = requireRole(session, ["ADMIN", "STAFF_TU"]);
    if (forbidden) return forbidden;

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const targetRole = formData.get("role") as string; // 'MAHASISWA', 'DOSEN', 'STAFF_TU'

    if (!file || !targetRole) {
      return NextResponse.json({ error: "Missing file or role parameter" }, { status: 400 });
    }

    const fileContent = await file.text();
    const parseResult = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

    if (parseResult.errors.length > 0) {
      return NextResponse.json({ error: "Error parsing CSV", details: parseResult.errors }, { status: 400 });
    }

    const records = parseResult.data as any[];
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Process each record sequentially or in a transaction
    for (const [index, row] of records.entries()) {
      try {
        await prisma.$transaction(async (tx) => {
          let username = "";
          const passwordStr = row.password_default || "password123";
          
          if (targetRole === "MAHASISWA") {
            username = row.nim;
          } else if (targetRole === "DOSEN") {
            username = row.nidn;
          } else if (targetRole === "STAFF_TU") {
            username = row.username;
          } else {
            throw new Error(`Unsupported role: ${targetRole}`);
          }

          if (!username) {
            throw new Error(`Row ${index + 1}: Missing identifier (nim/nidn/username)`);
          }

          // Check if user already exists
          const existingUser = await tx.user.findUnique({ where: { username } });
          if (existingUser) {
            throw new Error(`Row ${index + 1}: User with username ${username} already exists`);
          }

          // Create User
          const user = await tx.user.create({
            data: {
              username,
              passwordHash: hashPassword(passwordStr),
              role: targetRole as any,
            }
          });

          // Create Specific Role Profile
          if (targetRole === "MAHASISWA") {
            await tx.mahasiswa.create({
              data: {
                userId: user.id,
                nama: row.nama,
                nim: row.nim,
                email: row.email,
                noHp: row.no_hp || null,
                semesterAktif: parseInt(row.semester_aktif) || 1,
              }
            });
          } else if (targetRole === "DOSEN") {
            await tx.dosen.create({
              data: {
                userId: user.id,
                nama: row.nama,
                email: row.email,
                nidn: row.nidn,
                noHp: row.no_hp || null,
              }
            });
          } else if (targetRole === "STAFF_TU") {
            await tx.staffTU.create({
              data: {
                userId: user.id,
                nama: row.nama,
                email: row.email,
                unit: row.unit || "Umum",
              }
            });
          }
        });
        successCount++;
      } catch (err: any) {
        failedCount++;
        errors.push(err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import complete. ${successCount} succeeded, ${failedCount} failed.`,
      successCount,
      failedCount,
      errors
    });

  } catch (error: any) {
    console.error("Error importing users:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

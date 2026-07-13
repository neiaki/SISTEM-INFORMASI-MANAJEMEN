import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/kelompok?idMk=xxx&idProyek=xxx
 * Mengambil daftar kelompok. Mahasiswa hanya melihat kelompok dari MK yang diikuti.
 * Dosen hanya melihat kelompok dari MK yang diajarkan.
 */
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idMk = searchParams.get("idMk");
    const idProyek = searchParams.get("idProyek");

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    let allowedCourseIds: string[] | null = null;

    if (role === "MAHASISWA") {
      const mahasiswa = await prisma.mahasiswa.findUnique({ where: { userId } });
      if (!mahasiswa) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      const enrollments = await prisma.enrollment.findMany({ where: { idMahasiswa: mahasiswa.id } });
      allowedCourseIds = enrollments.map((e) => e.idMk);
    } else if (role === "DOSEN") {
      const dosen = await prisma.dosen.findUnique({ where: { userId } });
      if (!dosen) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      const courses = await prisma.mataKuliah.findMany({ where: { idDosen: dosen.id } });
      allowedCourseIds = courses.map((c) => c.id);
    }

    const where: any = {};
    if (allowedCourseIds) where.idMk = { in: allowedCourseIds };
    if (idMk) where.idMk = idMk;
    if (idProyek) where.idProyek = idProyek;

    const kelompoks = await prisma.kelompok.findMany({
      where,
      include: {
        mataKuliah: { select: { namaMk: true, kodeMk: true } },
        proyek: { select: { namaProyek: true } },
        anggota: {
          include: {
            mahasiswa: { select: { id: true, nama: true, nim: true } },
          },
        },
        _count: { select: { submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ kelompoks });
  } catch (error) {
    console.error("GET /api/kelompok Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/kelompok
 * Membuat kelompok baru. Hanya Dosen dan Admin yang bisa membuat kelompok secara resmi.
 * Mahasiswa bisa bergabung setelah kelompok dibuat.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    // Semua user (Dosen, Admin, Mahasiswa) bisa membuat kelompok
    // Mahasiswa mungkin membuat kelompok sendiri untuk tugas.

    const body = await req.json();
    const { idMk, idProyek, namaKelompok, anggotaIds } = body;

    if (!idMk || !namaKelompok) {
      return NextResponse.json({ error: "Missing required fields: idMk, namaKelompok" }, { status: 400 });
    }

    const newKelompok = await prisma.kelompok.create({
      data: {
        idMk,
        idProyek: idProyek || null,
        namaKelompok,
        // Jika anggotaIds diberikan, langsung daftarkan anggota
        anggota: anggotaIds?.length
          ? {
              create: (anggotaIds as string[]).map((idMahasiswa: string) => ({
                idMahasiswa,
                peran: "Anggota",
              })),
            }
          : undefined,
      },
      include: {
        anggota: {
          include: {
            mahasiswa: { select: { id: true, nama: true, nim: true } },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Kelompok created successfully", kelompok: newKelompok },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/kelompok Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

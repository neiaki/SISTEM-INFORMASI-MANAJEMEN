import { requireSession, requireRole } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/logger";
import { getPagination, buildPaginationMeta } from "@/lib/pagination";

export async function GET(req: Request) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const { role, userId } = session;
    const { searchParams } = new URL(req.url);
    const idTugas = searchParams.get("idTugas");
    const idKelompok = searchParams.get("idKelompok");

    const where: Record<string, unknown> = {};
    if (role === "MAHASISWA") {
      const mahasiswa = await prisma.mahasiswa.findUnique({ where: { userId } });
      if (!mahasiswa) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      where.idMahasiswa = mahasiswa.id;
    }
    if (idTugas) where.idTugas = idTugas;
    if (idKelompok) where.idKelompok = idKelompok;

    const pg = getPagination(searchParams.get("page"), searchParams.get("limit"));
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: { mahasiswa: true, tugas: true },
        orderBy: { createdAt: "desc" },
        skip: pg.skip,
        take: pg.take
      }),
      prisma.submission.count({ where })
    ]);

    return NextResponse.json({
      submissions,
      pagination: buildPaginationMeta(pg.page, pg.limit, total)
    });
  } catch (error) {
    console.error("GET /api/submission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;
    const forbidden = requireRole(session, ["MAHASISWA"]);
    if (forbidden) return forbidden;

    const userId = session.userId;
    const mahasiswa = await prisma.mahasiswa.findUnique({ where: { userId } });
    if (!mahasiswa) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { idTugas, idKelompok, fileName, fileSize, note, url, type } = body;

    if (!type || (!idTugas && !idKelompok)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newSubmission = await prisma.submission.create({
      data: {
        idTugas,
        idKelompok,
        idMahasiswa: mahasiswa.id,
        fileName,
        fileSize,
        note,
        url,
        type
      }
    });

    await logActivity({
      idReferensi: newSubmission.id,
      idMahasiswa: mahasiswa.id,
      catatan: idTugas ? `Mengumpulkan tugas: ${fileName || url}` : `Mengumpulkan progres proyek: ${fileName || url}`,
      persenProgres: 100
    });

    return NextResponse.json({ message: "Submission created", submission: newSubmission }, { status: 201 });
  } catch (error) {
    console.error("POST /api/submission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

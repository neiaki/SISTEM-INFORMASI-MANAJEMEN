import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/logger";
import { notifyEnrolledStudents } from "@/lib/notifikasi";
import { getPagination, buildPaginationMeta } from "@/lib/pagination";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idMk = searchParams.get("idMk");

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    if (role === "MAHASISWA") {
      const mahasiswa = await prisma.mahasiswa.findUnique({ where: { userId } });
      if (!mahasiswa) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

      const enrollments = await prisma.enrollment.findMany({
        where: { idMahasiswa: mahasiswa.id },
      });
      let courseIds = enrollments.map((e) => e.idMk);

      if (idMk) {
        if (!courseIds.includes(idMk)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        courseIds = [idMk];
      }

      const pageParam = searchParams.get("page");
      const pg = getPagination(pageParam, searchParams.get("limit"));

      const [projects, total] = await Promise.all([
        prisma.proyek.findMany({
          where: { idMk: { in: courseIds } },
          include: {
            mataKuliah: true,
            deliverables: true,
          },
          orderBy: { deadlineAkhir: "asc" },
          skip: pg.skip,
          take: pg.take,
        }),
        prisma.proyek.count({ where: { idMk: { in: courseIds } } }),
      ]);

      if (pageParam) {
        return NextResponse.json({ projects, pagination: buildPaginationMeta(pg.page, pg.limit, total) });
      }
      return NextResponse.json({ projects });
    }

    if (role === "DOSEN") {
      const dosen = await prisma.dosen.findUnique({ where: { userId } });
      if (!dosen) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

      const courses = await prisma.mataKuliah.findMany({
        where: { idDosen: dosen.id },
      });
      let courseIds = courses.map((c) => c.id);

      if (idMk) {
        if (!courseIds.includes(idMk)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        courseIds = [idMk];
      }

      const pageParam = searchParams.get("page");
      const pg = getPagination(pageParam, searchParams.get("limit"));

      const [projects, total] = await Promise.all([
        prisma.proyek.findMany({
          where: { idMk: { in: courseIds } },
          include: {
            mataKuliah: true,
            _count: { select: { kelompoks: true } },
          },
          orderBy: { deadlineAkhir: "desc" },
          skip: pg.skip,
          take: pg.take,
        }),
        prisma.proyek.count({ where: { idMk: { in: courseIds } } }),
      ]);

      if (pageParam) {
        return NextResponse.json({ projects, pagination: buildPaginationMeta(pg.page, pg.limit, total) });
      }
      return NextResponse.json({ projects });
    }

    return NextResponse.json({ projects: [] });
  } catch (error) {
    console.error("GET /api/proyek Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "DOSEN" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { idMk, namaProyek, deskripsi, tanggalMulai, deadlineAkhir, groupId } = body;

    if (!idMk || !namaProyek || !deadlineAkhir) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProject = await prisma.proyek.create({
      data: {
        idMk,
        namaProyek,
        deskripsi,
        tanggalMulai: tanggalMulai ? new Date(tanggalMulai) : new Date(),
        deadlineAkhir: new Date(deadlineAkhir),
        progresProyek: 0,
        ...(groupId ? { kelompoks: { connect: [{ id: groupId }] } } : {})
      },
    });

    const enrollments = await prisma.enrollment.findMany({ where: { idMk } });
    for (const en of enrollments) {
      await logActivity({
        idReferensi: newProject.id,
        idMahasiswa: en.idMahasiswa,
        catatan: `Proyek baru ditambahkan: ${namaProyek}`,
        persenProgres: 0
      });
    }

    // Auto-generate notification
    await notifyEnrolledStudents(
      idMk,
      `Proyek Baru: ${namaProyek}`,
      `Proyek baru telah ditambahkan. Deadline akhir: ${new Date(deadlineAkhir).toLocaleDateString("id-ID")}`,
      "INFO"
    );

    return NextResponse.json({ message: "Project created successfully", project: newProject }, { status: 201 });
  } catch (error) {
    console.error("POST /api/proyek Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

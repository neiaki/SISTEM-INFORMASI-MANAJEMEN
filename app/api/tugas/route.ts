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

      const [tasks, total] = await Promise.all([
        prisma.tugas.findMany({
          where: { idMk: { in: courseIds } },
          include: {
            mataKuliah: true,
            submissions: { where: { idMahasiswa: mahasiswa.id } },
          },
          orderBy: { deadline: "asc" },
          skip: pg.skip,
          take: pg.take,
        }),
        prisma.tugas.count({ where: { idMk: { in: courseIds } } }),
      ]);

      if (pageParam) {
        return NextResponse.json({ tasks, pagination: buildPaginationMeta(pg.page, pg.limit, total) });
      }
      return NextResponse.json({ tasks });
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

      const [tasks, total] = await Promise.all([
        prisma.tugas.findMany({
          where: { idMk: { in: courseIds } },
          include: {
            mataKuliah: true,
            _count: { select: { submissions: true } },
          },
          orderBy: { deadline: "desc" },
          skip: pg.skip,
          take: pg.take,
        }),
        prisma.tugas.count({ where: { idMk: { in: courseIds } } }),
      ]);

      if (pageParam) {
        return NextResponse.json({ tasks, pagination: buildPaginationMeta(pg.page, pg.limit, total) });
      }
      return NextResponse.json({ tasks });
    }

    return NextResponse.json({ tasks: [] });
  } catch (error) {
    console.error("GET /api/tugas Error:", error);
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
    const { idMk, judul, deskripsi, deadline, bobotNilai, jenis, tipe } = body;

    if (!idMk || !judul || !deadline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTask = await prisma.tugas.create({
      data: {
        idMk,
        judul,
        deskripsi,
        tanggalDiberikan: new Date(),
        deadline: new Date(deadline),
        bobotNilai: bobotNilai || 100,
        jenis: jenis || "Individu",
        statusGlobal: "Sedang Dikerjakan",
        tipe: tipe || "Tugas",
      },
    });

    // Logging aktivitas for all enrolled mahasiswa
    const enrollments = await prisma.enrollment.findMany({ where: { idMk } });
    for (const en of enrollments) {
      await logActivity({
        idReferensi: newTask.id,
        idMahasiswa: en.idMahasiswa,
        catatan: `Tugas baru ditambahkan: ${judul}`,
        persenProgres: 0
      });
    }

    // Auto-generate notification
    await notifyEnrolledStudents(
      idMk,
      `Tugas Baru: ${judul}`,
      `Tugas baru telah ditambahkan. Deadline: ${new Date(deadline).toLocaleDateString("id-ID")}`,
      "INFO"
    );

    return NextResponse.json({ message: "Task created successfully", task: newTask }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tugas Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

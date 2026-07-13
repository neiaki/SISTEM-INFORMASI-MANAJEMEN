import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    if (role !== "MAHASISWA") {
      return NextResponse.json({ error: "Only available for Mahasiswa" }, { status: 403 });
    }

    const mahasiswa = await prisma.mahasiswa.findUnique({ where: { userId } });
    if (!mahasiswa) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get all enrolled courses
    const enrollments = await prisma.enrollment.findMany({
      where: { idMahasiswa: mahasiswa.id },
      include: {
        mataKuliah: true,
      }
    });
    const courseIds = enrollments.map(e => e.idMk);

    // Get all tasks for these courses
    const tasks = await prisma.tugas.findMany({
      where: { idMk: { in: courseIds } },
      include: {
        mataKuliah: true,
        submissions: {
          where: { idMahasiswa: mahasiswa.id } // Only user's submissions
        }
      }
    });

    // Process data
    let totalTasks = tasks.length;
    let totalDone = 0;
    let totalActive = 0;
    let totalLate = 0;
    let totalMenungguReview = 0;

    const courseStatsMap: Record<string, any> = {};

    enrollments.forEach(en => {
      courseStatsMap[en.mataKuliah.namaMk] = {
        course: en.mataKuliah.namaMk,
        total: 0,
        done: 0,
        running: 0,
        late: 0,
      };
    });

    tasks.forEach(task => {
      const courseName = task.mataKuliah.namaMk;
      if (!courseStatsMap[courseName]) return;

      courseStatsMap[courseName].total++;

      const sub = task.submissions[0]; // because we filtered where idMahasiswa
      const isDone = sub !== undefined;
      const isLate = !isDone && (new Date(task.deadline).getTime() < Date.now());
      
      if (isDone) {
        totalDone++;
        courseStatsMap[courseName].done++;
      } else {
        courseStatsMap[courseName].running++;
        totalActive++;
        if (isLate) {
          totalLate++;
          courseStatsMap[courseName].late++;
        }
      }
    });

    // Formatting for the frontend
    const courseStats = Object.values(courseStatsMap).map((stat: any) => ({
      course: stat.course,
      total: stat.total,
      done: stat.done,
      running: stat.running,
      late: stat.late,
      pct: stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0,
      avg: 82, // Mock placeholder since grades aren't stored in DB yet
      classAvg: 80 // Mock placeholder
    }));

    return NextResponse.json({
      summary: {
        totalTasks,
        totalDone,
        totalActive,
        totalLate,
        totalMenungguReview,
        averageNilai: 82.4, // Mock placeholder
      },
      courseStats,
      weekly: [
        { label: "Minggu 1", done: 2 },
        { label: "Minggu 2", done: 5 },
        { label: "Minggu 3", done: 3 },
        { label: "Minggu 4", done: Math.min(totalDone, 12) }, 
      ] // Mocking weekly data as it requires complex date tracking of submissions
    });

  } catch (error) {
    console.error("GET /api/laporan Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

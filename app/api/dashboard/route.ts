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

    if (role === "MAHASISWA") {
      const mahasiswa = await prisma.mahasiswa.findUnique({
        where: { userId },
      });

      if (!mahasiswa) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }

      // 1. Get Enrolled Courses
      const enrollments = await prisma.enrollment.findMany({
        where: { idMahasiswa: mahasiswa.id },
        select: { idMk: true },
      });
      const courseIds = enrollments.map((e) => e.idMk);

      // 2. Get All Tasks for Enrolled Courses
      const allTasks = await prisma.tugas.findMany({
        where: { idMk: { in: courseIds } },
        include: {
          mataKuliah: true,
          submissions: {
            where: { idMahasiswa: mahasiswa.id },
          },
        },
        orderBy: { deadline: "asc" },
      });

      // Demo override: Use May 8, 2026 as "today" if in dev mode to match seed data
      const today = process.env.NODE_ENV === "development" ? new Date("2026-05-08") : new Date();
      const threeDaysFromNow = new Date(today);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const activeTasks = allTasks.filter((t) => t.submissions.length === 0 && new Date(t.deadline) >= today);
      const urgentTasks = activeTasks.filter((t) => new Date(t.deadline) <= threeDaysFromNow && t.submissions.length === 0);
      const completedTasks = allTasks.filter((t) => t.submissions.length > 0);

      // 3. Get Projects
      const allProjects = await prisma.proyek.findMany({
        where: { idMk: { in: courseIds } },
        include: { mataKuliah: true },
      });

      // 4. Format Upcoming Deadlines
      const upcomingDeadlines = activeTasks.map((t) => ({
        id: t.id,
        title: t.judul,
        subject: t.mataKuliah.namaMk,
        type: t.jenis,
        deadline: t.deadline.toISOString(),
        status: "Belum Mulai",
      }));

      return NextResponse.json({
        stats: {
          activeTasks: activeTasks.length,
          urgentTasks: urgentTasks.length,
          activeProjects: allProjects.length,
          completedTasksThisMonth: completedTasks.length,
        },
        upcomingDeadlines: upcomingDeadlines.slice(0, 5),
        projects: allProjects.map((p) => ({
          id: p.id,
          name: p.namaProyek,
          subject: p.mataKuliah.namaMk,
          progress: p.progresProyek,
        })),
      });
    }

    if (role === "DOSEN") {
      const dosen = await prisma.dosen.findUnique({
        where: { userId },
      });

      if (!dosen) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }

      // 1. Get Taught Courses
      const mataKuliah = await prisma.mataKuliah.findMany({
        where: { idDosen: dosen.id },
      });
      const courseIds = mataKuliah.map(m => m.id);

      // 2. Get Tasks and Submissions
      const allTasks = await prisma.tugas.findMany({
        where: { idMk: { in: courseIds } },
        include: {
          mataKuliah: true,
          submissions: {
            include: { mahasiswa: true }
          }
        },
        orderBy: { deadline: "asc" }
      });

      const today = process.env.NODE_ENV === "development" ? new Date("2026-05-08") : new Date();
      const threeDaysFromNow = new Date(today);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const activeTasks = allTasks.filter((t) => new Date(t.deadline) >= today);
      const urgentMissing = activeTasks.filter((t) => new Date(t.deadline) <= threeDaysFromNow && t.submissions.length === 0).length;
      
      const allSubmissions = allTasks.flatMap(t => 
        t.submissions.map(s => ({
          id: s.id,
          taskTitle: t.judul,
          taskCourse: t.mataKuliah.namaMk,
          submittedBy: s.mahasiswa?.nama || "Mahasiswa",
          submittedAtMs: new Date().getTime(), // In real app, we'd use s.createdAt
        }))
      );
      
      return NextResponse.json({
        stats: {
          activeTasks: activeTasks.length,
          submissionsReceived: allSubmissions.length,
          urgentMissing: urgentMissing,
          courses: mataKuliah.length,
        },
        recentSubs: allSubmissions.slice(0, 5),
        runningTasks: activeTasks.map(t => ({
          id: t.id,
          title: t.judul,
          subject: t.mataKuliah.namaMk,
          submittedCount: t.submissions.length,
          deadline: t.deadline.toISOString()
        }))
      });
    }

    return NextResponse.json({ message: "Dashboard for this role is not implemented yet." });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

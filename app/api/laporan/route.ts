import { requireSession } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await requireSession();
    if (session instanceof NextResponse) return session;

    const { role, userId } = session;

    if (role === "MAHASISWA") {
      const mahasiswa = await prisma.mahasiswa.findUnique({ where: { userId } });
      if (!mahasiswa) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

      // Get enrolled courses
      const enrollments = await prisma.enrollment.findMany({
        where: { idMahasiswa: mahasiswa.id },
        include: { mataKuliah: true }
      });
      const courseIds = enrollments.map(e => e.idMk);

      // Get tasks
      const tasks = await prisma.tugas.findMany({
        where: { idMk: { in: courseIds } },
        include: {
          mataKuliah: true,
          submissions: { where: { idMahasiswa: mahasiswa.id } }
        }
      });

      // Get all class submissions with grades for class averages
      const classSubmissions = await prisma.submission.findMany({
        where: { tugas: { idMk: { in: courseIds } }, nilai: { not: null } },
        include: { tugas: { include: { mataKuliah: true } } }
      });

      let totalTasks = tasks.length;
      let totalDone = 0;
      let totalActive = 0;
      let totalLate = 0;
      let totalMenungguReview = 0;
      let sumNilai = 0;
      let countNilai = 0;

      const courseStatsMap: Record<string, any> = {};
      enrollments.forEach(en => {
        courseStatsMap[en.mataKuliah.namaMk] = {
          course: en.mataKuliah.namaMk,
          total: 0, done: 0, running: 0, late: 0,
          sumNilai: 0, countNilai: 0,
          classSumNilai: 0, classCountNilai: 0,
        };
      });

      tasks.forEach(task => {
        const courseName = task.mataKuliah.namaMk;
        if (!courseStatsMap[courseName]) return;

        courseStatsMap[courseName].total++;
        const sub = task.submissions[0];
        const isDone = sub !== undefined;
        const isLate = !isDone && (new Date(task.deadline).getTime() < Date.now());
        
        if (isDone) {
          totalDone++;
          courseStatsMap[courseName].done++;
          if (sub.nilai !== null && sub.nilai !== undefined) {
            sumNilai += sub.nilai;
            countNilai++;
            courseStatsMap[courseName].sumNilai += sub.nilai;
            courseStatsMap[courseName].countNilai++;
          }
        } else {
          courseStatsMap[courseName].running++;
          totalActive++;
          if (isLate) {
            totalLate++;
            courseStatsMap[courseName].late++;
          }
        }
      });

      classSubmissions.forEach(sub => {
        const courseName = sub.tugas?.mataKuliah?.namaMk;
        if (courseName && courseStatsMap[courseName] && sub.nilai !== null) {
          courseStatsMap[courseName].classSumNilai += sub.nilai;
          courseStatsMap[courseName].classCountNilai++;
        }
      });

      const averageNilai = countNilai > 0 ? (sumNilai / countNilai).toFixed(1) : 0;
      
      const courseStats = Object.values(courseStatsMap).map((stat: any) => ({
        course: stat.course,
        total: stat.total,
        done: stat.done,
        running: stat.running,
        late: stat.late,
        pct: stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0,
        avg: stat.countNilai > 0 ? Math.round(stat.sumNilai / stat.countNilai) : 0,
        classAvg: stat.classCountNilai > 0 ? Math.round(stat.classSumNilai / stat.classCountNilai) : 0
      }));

      return NextResponse.json({
        summary: { totalTasks, totalDone, totalActive, totalLate, totalMenungguReview, averageNilai },
        courseStats,
        weekly: [
          { label: "Minggu 1", done: 2 }, { label: "Minggu 2", done: 5 }, { label: "Minggu 3", done: 3 }, { label: "Minggu 4", done: Math.min(totalDone, 12) }, 
        ]
      });

    } else if (role === "DOSEN") {
      const dosen = await prisma.dosen.findUnique({ where: { userId } });
      if (!dosen) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

      // Dosen courses
      const courses = await prisma.mataKuliah.findMany({
        where: { idDosen: dosen.id },
        include: { enrollments: true }
      });
      const courseIds = courses.map(c => c.id);

      const tasks = await prisma.tugas.findMany({
        where: { idMk: { in: courseIds } },
        include: {
          mataKuliah: true,
          submissions: true
        }
      });

      let totalSubmissions = 0;
      let totalLate = 0;
      let sumNilai = 0;
      let countNilai = 0;
      
      const courseStatsMap: Record<string, any> = {};
      courses.forEach(c => {
        courseStatsMap[c.namaMk] = {
          course: c.namaMk,
          totalStudents: c.enrollments.length,
          totalTasks: 0,
          expectedSubmissions: 0,
          actualSubmissions: 0,
          sumNilai: 0,
          countNilai: 0,
          highest: 0,
          lowest: 100,
          passed: 0,
          failed: 0,
        };
      });

      tasks.forEach(task => {
        const cName = task.mataKuliah.namaMk;
        const stat = courseStatsMap[cName];
        if (!stat) return;

        stat.totalTasks++;
        stat.expectedSubmissions += stat.totalStudents;
        stat.actualSubmissions += task.submissions.length;
        totalSubmissions += task.submissions.length;

        task.submissions.forEach(sub => {
          if (sub.nilai !== null && sub.nilai !== undefined) {
            sumNilai += sub.nilai;
            countNilai++;
            stat.sumNilai += sub.nilai;
            stat.countNilai++;
            if (sub.nilai > stat.highest) stat.highest = sub.nilai;
            if (sub.nilai < stat.lowest) stat.lowest = sub.nilai;
            if (sub.nilai >= 60) stat.passed++;
            else stat.failed++;
          }
        });
      });

      const averageNilai = countNilai > 0 ? (sumNilai / countNilai).toFixed(1) : 0;
      let expectedTotalSubmissions = 0;

      const courseStats = Object.values(courseStatsMap).map((stat: any) => {
        expectedTotalSubmissions += stat.expectedSubmissions;
        const avg = stat.countNilai > 0 ? (stat.sumNilai / stat.countNilai).toFixed(1) : null;
        const totalGraded = stat.passed + stat.failed;
        return {
          course: stat.course,
          students: stat.totalStudents,
          expectedSubs: stat.expectedSubmissions,
          actualSubs: stat.actualSubmissions,
          avg,
          high: stat.countNilai > 0 ? stat.highest : null,
          low: stat.countNilai > 0 ? stat.lowest : null,
          pass: stat.countNilai > 0 ? stat.passed : null,
          fail: stat.countNilai > 0 ? stat.failed : null,
          passP: totalGraded > 0 ? Math.round((stat.passed / totalGraded) * 100) : null,
          failP: totalGraded > 0 ? Math.round((stat.failed / totalGraded) * 100) : null,
        };
      });

      const completionRate = expectedTotalSubmissions > 0 ? Math.round((totalSubmissions / expectedTotalSubmissions) * 100) : 0;

      return NextResponse.json({
        summary: {
          totalSubmissions,
          totalLate, // Needs more complex tracking for late submissions on Dosen side
          averageNilai,
          completionRate: `${completionRate}%`
        },
        courseStats,
        weekly: [
          { label: "Mg 1", count: 28 }, { label: "Mg 2", count: 42 }, { label: "Mg 3", count: 35 }, { label: "Mg 4", count: 52 }, { label: "Mg 5", count: 30 }
        ]
      });
    }

    return NextResponse.json({ error: "Role not supported" }, { status: 400 });
  } catch (error) {
    console.error("GET /api/laporan Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

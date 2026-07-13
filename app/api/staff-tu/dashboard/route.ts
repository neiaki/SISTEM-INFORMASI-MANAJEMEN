import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "STAFF_TU") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalMahasiswa = await prisma.mahasiswa.count();
    const totalDosen = await prisma.dosen.count();
    const totalKelas = await prisma.mataKuliah.count();
    
    // Simulate some "Backlog" tasks for Staff TU
    const tasks = [
      { id: "op-1", title: "Validasi KRS Mahasiswa Baru", course: "Semua Kelas", status: "menunggu review" },
      { id: "op-2", title: "Setup Akses LMS untuk Dosen Eksternal", course: "Sistem Informasi", status: "sedang dikerjakan" },
      { id: "op-3", title: "Pemetaan Kelas Semester Genap", course: "Akademik", status: "belum mulai" },
    ];

    // Simulate "Notifikasi"
    const notifications = await prisma.notifikasi.findMany({
      where: { idUser: (session.user as any).id },
      orderBy: { waktuKirim: "desc" },
      take: 5
    });

    return NextResponse.json({
      stats: {
        totalMahasiswa,
        totalDosen,
        totalKelas,
        backlogAktif: tasks.filter(t => t.status !== "selesai").length,
      },
      tasks,
      notifications
    });

  } catch (error) {
    console.error("Staff TU Dashboard Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
